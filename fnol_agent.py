"""
FNOL Claims Processing Agent
Extracts, validates, classifies, and routes insurance claims using Claude AI.
"""

import os
import json
import re
from pathlib import Path
import anthropic

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

FNOL_DIR = Path(__file__).parent.parent / "fnol_documents"
OUTPUT_DIR = Path(__file__).parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

FAST_TRACK_THRESHOLD = 25000   # INR
FRAUD_KEYWORDS = ["fraud", "inconsistent", "staged", "suspicious", "fabricated", "false"]

MANDATORY_FIELDS = [
    "policy_number",
    "policyholder_name",
    "policy_effective_date",
    "incident_date",
    "incident_location",
    "incident_description",
    "claimant_name",
    "claimant_contact",
    "asset_type",
    "estimated_damage",
    "claim_type",
    "initial_estimate",
]

EXTRACTION_SYSTEM_PROMPT = """You are a precise insurance claims data extraction assistant.
Given a FNOL (First Notice of Loss) document, extract every field into a flat JSON object.
Use snake_case keys. If a field is missing, absent, or explicitly says "NOT PROVIDED", use null.

Return ONLY raw JSON with no markdown fences, no explanation, just the JSON object.

Required keys to extract (use null if absent):
- policy_number
- policyholder_name
- policy_effective_date
- policy_expiry_date
- incident_date
- incident_time
- incident_location
- incident_description
- claimant_name
- claimant_contact
- claimant_email
- third_party_name
- third_party_contact
- asset_type
- asset_id
- estimated_damage_inr  (extract numeric value only, integer)
- claim_type
- attachments           (list of strings)
- initial_estimate_inr  (extract numeric value only, integer)

Do not add extra keys. Do not wrap in markdown. Output raw JSON only."""


def load_document(filepath: Path) -> str:
    return filepath.read_text(encoding="utf-8")


def extract_fields(client: anthropic.Anthropic, document_text: str) -> dict:
    """Use Claude to extract structured fields from raw FNOL text."""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=EXTRACTION_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": document_text}],
    )
    raw = response.content[0].text.strip()
    # Strip accidental markdown fences
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"```$", "", raw)
    return json.loads(raw)


def identify_missing_fields(fields: dict) -> list[str]:
    """Return list of mandatory fields that are null/missing."""
    missing = []
    for key in MANDATORY_FIELDS:
        val = fields.get(key)
        if val is None or (isinstance(val, str) and val.strip().upper() in ("", "NOT PROVIDED", "N/A")):
            missing.append(key)
    return missing


def contains_fraud_keywords(fields: dict) -> list[str]:
    """Check incident description for fraud-related keywords."""
    description = (fields.get("incident_description") or "").lower()
    return [kw for kw in FRAUD_KEYWORDS if kw in description]


def route_claim(fields: dict, missing_fields: list[str]) -> tuple[str, str]:
    """
    Apply routing rules and return (route, reasoning).

    Priority order:
      1. Investigation Flag  — fraud keywords in description
      2. Specialist Queue    — claim_type == injury
      3. Manual Review       — any mandatory field missing
      4. Fast-track          — estimated_damage < 25,000
      5. Standard Review     — fallback
    """
    fraud_hits = contains_fraud_keywords(fields)
    claim_type = (fields.get("claim_type") or "").lower()
    damage = fields.get("estimated_damage_inr") or fields.get("initial_estimate_inr")

    # Rule 1 – Fraud / Investigation
    if fraud_hits:
        return (
            "Investigation Flag",
            f"Incident description contains fraud-indicator keywords: {fraud_hits}. "
            "Claim has been flagged for Special Investigations Unit (SIU) review.",
        )

    # Rule 2 – Injury → Specialist Queue
    if "injury" in claim_type:
        return (
            "Specialist Queue",
            "Claim type is classified as 'Injury'. Routed to specialist medical/legal claims handlers "
            "who are equipped to assess bodily injury, liability, and rehabilitation costs.",
        )

    # Rule 3 – Missing mandatory fields → Manual Review
    if missing_fields:
        return (
            "Manual Review",
            f"The following mandatory fields are missing or incomplete: {missing_fields}. "
            "A claims officer must collect the missing information before processing can continue.",
        )

    # Rule 4 – Low damage → Fast-track
    try:
        damage_val = int(damage)
        if damage_val < FAST_TRACK_THRESHOLD:
            return (
                "Fast-track",
                f"Estimated damage (INR {damage_val:,}) is below the INR {FAST_TRACK_THRESHOLD:,} threshold. "
                "All mandatory fields are present and no fraud indicators detected. "
                "Eligible for automated fast-track processing.",
            )
    except (TypeError, ValueError):
        pass

    # Rule 5 – Standard Review
    return (
        "Standard Review",
        f"Estimated damage (INR {damage:,}) exceeds the fast-track threshold of INR {FAST_TRACK_THRESHOLD:,}. "
        "All mandatory fields are present and no fraud indicators detected. "
        "Assigned to standard claims review workflow.",
    )


def process_fnol(client: anthropic.Anthropic, filepath: Path) -> dict:
    """End-to-end processing of a single FNOL document."""
    print(f"\n  Processing: {filepath.name}")
    document_text = load_document(filepath)
    extracted = extract_fields(client, document_text)
    missing = identify_missing_fields(extracted)
    route, reasoning = route_claim(extracted, missing)

    result = {
        "document": filepath.name,
        "extractedFields": extracted,
        "missingFields": missing,
        "recommendedRoute": route,
        "reasoning": reasoning,
    }

    # Save individual result
    out_path = OUTPUT_DIR / filepath.with_suffix(".json").name
    out_path.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    print(f"  ✓ Route: {route}")
    return result


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY environment variable not set.")

    client = anthropic.Anthropic(api_key=api_key)
    fnol_files = sorted(FNOL_DIR.glob("*.txt"))

    if not fnol_files:
        print(f"No FNOL .txt files found in {FNOL_DIR}")
        return

    print(f"\n{'═'*55}")
    print(" FNOL Claims Processing Agent")
    print(f"{'═'*55}")
    print(f" Found {len(fnol_files)} document(s) to process.\n")

    all_results = []
    for f in fnol_files:
        result = process_fnol(client, f)
        all_results.append(result)

    # Save consolidated report
    summary_path = OUTPUT_DIR / "claims_summary.json"
    summary_path.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))

    print(f"\n{'═'*55}")
    print(" Processing Complete")
    print(f"{'═'*55}")
    print(f" Results saved to: {OUTPUT_DIR}/")
    print(f" Summary file:     claims_summary.json\n")

    # Print routing summary table
    print(f" {'Document':<20} {'Route':<22} {'Missing Fields'}")
    print(f" {'-'*20} {'-'*22} {'-'*20}")
    for r in all_results:
        missing = len(r["missingFields"])
        m_str = f"{missing} field(s)" if missing else "None"
        print(f" {r['document']:<20} {r['recommendedRoute']:<22} {m_str}")
    print()


if __name__ == "__main__":
    main()
