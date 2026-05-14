import { useState } from "react";

const CLAIMS_DATA = [
  {
    document: "FNOL_001.txt",
    extractedFields: {
      policy_number: "POL-AUTO-2024-78432",
      policyholder_name: "Rajesh Kumar Sharma",
      policy_effective_date: "01/01/2024",
      policy_expiry_date: "31/12/2024",
      incident_date: "15/03/2024",
      incident_time: "14:35",
      incident_location: "NH-48, Near Gurugram Toll Plaza, Haryana",
      incident_description: "Policyholder's vehicle was rear-ended by a speeding truck while waiting at toll plaza. Vehicle sustained damage to rear bumper, trunk, and tail lights.",
      claimant_name: "Rajesh Kumar Sharma",
      claimant_contact: "+91-98765-43210",
      claimant_email: "rajesh.sharma@email.com",
      third_party_name: "Ram Singh (Truck Driver)",
      third_party_contact: "+91-87654-32109",
      asset_type: "Motor Vehicle",
      asset_id: "DL-01-XY-5678",
      estimated_damage_inr: 18500,
      claim_type: "Property Damage",
      attachments: ["Photos_FNOL001.zip", "Police_Report_GGN_2024.pdf"],
      initial_estimate_inr: 18500,
    },
    missingFields: [],
    recommendedRoute: "Fast-track",
    reasoning: "Estimated damage (INR 18,500) is below the INR 25,000 threshold. All mandatory fields are present and no fraud indicators detected. Eligible for automated fast-track processing.",
  },
  {
    document: "FNOL_002.txt",
    extractedFields: {
      policy_number: "POL-HOME-2023-44211",
      policyholder_name: "Priya Mehta",
      policy_effective_date: "15/06/2023",
      policy_expiry_date: "14/06/2025",
      incident_date: "22/03/2024",
      incident_time: "03:15",
      incident_location: "14B, Lakeview Apartments, Powai, Mumbai",
      incident_description: "A major water pipe burst on the 4th floor caused extensive flooding to the 3rd floor apartment. Damage includes warped flooring, damaged drywall, electrical fixtures, furniture and appliances.",
      claimant_name: "Priya Mehta",
      claimant_contact: "+91-99887-76655",
      claimant_email: "priya.mehta@corporateemail.com",
      third_party_name: "Society Maintenance Committee",
      third_party_contact: "Suresh Nair, +91-98110-22334",
      asset_type: "Residential Property",
      asset_id: "Flat No. 3B, Lakeview Apartments",
      estimated_damage_inr: 87000,
      claim_type: "Property Damage",
      attachments: ["Water_Damage_Photos.pdf", "Plumber_Report.pdf", "Repair_Quotes.xlsx"],
      initial_estimate_inr: 87000,
    },
    missingFields: [],
    recommendedRoute: "Standard Review",
    reasoning: "Estimated damage (INR 87,000) exceeds the fast-track threshold of INR 25,000. All mandatory fields present, no fraud indicators. Assigned to standard claims review workflow.",
  },
  {
    document: "FNOL_003.txt",
    extractedFields: {
      policy_number: "POL-HEALTH-2024-10029",
      policyholder_name: "Amit Verma",
      policy_effective_date: "01/04/2024",
      policy_expiry_date: "31/03/2025",
      incident_date: "10/04/2024",
      incident_time: "09:50",
      incident_location: "Construction Site, Sector 62, Noida, Uttar Pradesh",
      incident_description: "Policyholder sustained injuries due to scaffolding collapse at worksite — fractured left arm, bruised ribs (3 fractures), forehead lacerations. Hospitalized at Max Hospital Noida for 3 days.",
      claimant_name: "Amit Verma",
      claimant_contact: "+91-70099-88776",
      claimant_email: "amit.verma.noida@gmail.com",
      third_party_name: "BuildRight Constructions Pvt. Ltd.",
      third_party_contact: "+91-11-45678901",
      asset_type: "N/A (Personal Injury Claim)",
      asset_id: null,
      estimated_damage_inr: 42000,
      claim_type: "Injury",
      attachments: ["Hospital_Discharge_Summary.pdf", "Medical_Bills.pdf", "X-Ray_Reports.zip"],
      initial_estimate_inr: 42000,
    },
    missingFields: [],
    recommendedRoute: "Specialist Queue",
    reasoning: "Claim type is classified as 'Injury'. Routed to specialist medical/legal claims handlers equipped to assess bodily injury, liability, and rehabilitation costs.",
  },
  {
    document: "FNOL_004.txt",
    extractedFields: {
      policy_number: "POL-AUTO-2023-55901",
      policyholder_name: "Deepak Joshi",
      policy_effective_date: "10/10/2023",
      policy_expiry_date: "09/10/2024",
      incident_date: "01/04/2024",
      incident_time: "23:45",
      incident_location: "Isolated stretch, Old Mumbai-Pune Highway, Maharashtra",
      incident_description: "Claimant states vehicle was struck by an unidentified vehicle that fled the scene. Timeline appears inconsistent with GPS data. Damage pattern is inconsistent with described collision angle. A mechanic indicated the damage may have been staged prior to the reported incident.",
      claimant_name: "Deepak Joshi",
      claimant_contact: "+91-81234-56789",
      claimant_email: "deepakj.claims@fastmail.com",
      third_party_name: "Unknown (Hit and Run)",
      third_party_contact: null,
      asset_type: "Motor Vehicle",
      asset_id: "MH-12-CD-9876",
      estimated_damage_inr: 95000,
      claim_type: "Property Damage",
      attachments: ["Vehicle_Damage_Photos.zip"],
      initial_estimate_inr: 95000,
    },
    missingFields: [],
    recommendedRoute: "Investigation Flag",
    reasoning: "Incident description contains fraud-indicator keywords: ['inconsistent', 'staged']. Claim has been flagged for Special Investigations Unit (SIU) review.",
  },
  {
    document: "FNOL_005.txt",
    extractedFields: {
      policy_number: "POL-TRAVEL-2024-00871",
      policyholder_name: "Sneha Kapoor",
      policy_effective_date: null,
      policy_expiry_date: null,
      incident_date: "05/05/2024",
      incident_time: null,
      incident_location: "Charles de Gaulle Airport, Paris, France",
      incident_description: "Policyholder's checked baggage was lost by the airline during a connecting flight from Paris to London. Airline issued a PIR report but has not located baggage after 7 days.",
      claimant_name: "Sneha Kapoor",
      claimant_contact: null,
      claimant_email: "sneha.kapoor@travelmail.com",
      third_party_name: "Air France",
      third_party_contact: "Air France Customer Relations, Paris Hub",
      asset_type: "Personal Belongings / Travel Baggage",
      asset_id: "AF-2024-XKJ991",
      estimated_damage_inr: null,
      claim_type: "Travel / Baggage Loss",
      attachments: ["PIR_Report_AirFrance.pdf"],
      initial_estimate_inr: null,
    },
    missingFields: ["policy_effective_date", "claimant_contact", "estimated_damage", "initial_estimate"],
    recommendedRoute: "Manual Review",
    reasoning: "The following mandatory fields are missing or incomplete: ['policy_effective_date', 'claimant_contact', 'estimated_damage', 'initial_estimate']. A claims officer must collect the missing information before processing can continue.",
  },
];

const ROUTE_CONFIG = {
  "Fast-track": { color: "#22c55e", bg: "#052e16", border: "#166534", icon: "⚡", badge: "bg-emerald-900 text-emerald-300 border-emerald-700" },
  "Standard Review": { color: "#60a5fa", bg: "#0f172a", border: "#1e3a5f", icon: "📋", badge: "bg-blue-900 text-blue-300 border-blue-700" },
  "Specialist Queue": { color: "#a78bfa", bg: "#1e1035", border: "#4c1d95", icon: "👨‍⚕️", badge: "bg-violet-900 text-violet-300 border-violet-700" },
  "Investigation Flag": { color: "#f97316", bg: "#1c0a00", border: "#7c2d12", icon: "🚨", badge: "bg-orange-900 text-orange-300 border-orange-700" },
  "Manual Review": { color: "#fbbf24", bg: "#1c1500", border: "#78350f", icon: "✏️", badge: "bg-amber-900 text-amber-300 border-amber-700" },
};

const fmt = (v) => v === null || v === undefined ? <span className="text-gray-600 italic text-xs">— null —</span> : String(v);
const fmtInr = (v) => v ? `₹${Number(v).toLocaleString("en-IN")}` : null;

function Badge({ route }) {
  const cfg = ROUTE_CONFIG[route] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.badge}`}>
      <span>{cfg.icon}</span>{route}
    </span>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{label}</p>
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-gray-600">{sub}</p>}
    </div>
  );
}

function FieldGrid({ fields }) {
  const entries = Object.entries(fields);
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-start gap-2 text-xs">
          <span className="text-gray-500 font-mono min-w-[170px] shrink-0">{k}</span>
          <span className="text-gray-200 break-all">
            {Array.isArray(v)
              ? v.map((a, i) => <span key={i} className="inline-block bg-gray-800 rounded px-1.5 py-0.5 mr-1 mb-1 font-mono text-gray-300">{a}</span>)
              : k.includes("inr") && v
                ? <span className="text-emerald-400 font-bold">{fmtInr(v)}</span>
                : fmt(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ClaimCard({ claim, isSelected, onClick }) {
  const cfg = ROUTE_CONFIG[claim.recommendedRoute] || {};
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01] ${
        isSelected ? "border-opacity-100 ring-1" : "border-gray-800 hover:border-gray-700"
      }`}
      style={isSelected ? { borderColor: cfg.color, boxShadow: `0 0 0 1px ${cfg.color}30`, background: cfg.bg } : {}}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs font-mono text-gray-500">{claim.document}</p>
          <p className="text-sm font-bold text-white">{claim.extractedFields.policyholder_name}</p>
        </div>
        <Badge route={claim.recommendedRoute} />
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{claim.extractedFields.claim_type}</span>
        <span>·</span>
        <span>{claim.extractedFields.estimated_damage_inr ? fmtInr(claim.extractedFields.estimated_damage_inr) : "N/A"}</span>
        {claim.missingFields.length > 0 && (
          <>
            <span>·</span>
            <span className="text-amber-500">{claim.missingFields.length} missing</span>
          </>
        )}
      </div>
    </button>
  );
}

function PipelineViz({ route }) {
  const steps = [
    { id: "extract", label: "Extract Fields", icon: "🔍" },
    { id: "validate", label: "Validate", icon: "✅" },
    { id: "classify", label: "Classify", icon: "🤖" },
    { id: "route", label: route, icon: ROUTE_CONFIG[route]?.icon || "📤" },
  ];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border"
            style={i === steps.length - 1 ? {
              borderColor: ROUTE_CONFIG[route]?.color,
              color: ROUTE_CONFIG[route]?.color,
              background: ROUTE_CONFIG[route]?.bg,
            } : { borderColor: "#374151", color: "#9ca3af", background: "#111827" }}
          >
            <span>{s.icon}</span><span>{s.label}</span>
          </div>
          {i < steps.length - 1 && <span className="text-gray-700 text-xs">→</span>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("fields");

  const claim = CLAIMS_DATA[selected];
  const cfg = ROUTE_CONFIG[claim.recommendedRoute] || {};

  const totalDmg = CLAIMS_DATA.reduce((s, c) => s + (c.extractedFields.estimated_damage_inr || 0), 0);
  const flagged = CLAIMS_DATA.filter(c => c.recommendedRoute === "Investigation Flag").length;
  const missing = CLAIMS_DATA.filter(c => c.missingFields.length > 0).length;

  const routeCounts = CLAIMS_DATA.reduce((acc, c) => {
    acc[c.recommendedRoute] = (acc[c.recommendedRoute] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans" style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">⚖</div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">FNOL CLAIMS AGENT</h1>
              <p className="text-xs text-gray-500">Autonomous Insurance Processing System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500">5 documents processed</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Claims" value={CLAIMS_DATA.length} sub="documents ingested" color="#60a5fa" />
          <StatCard label="Total Exposure" value={`₹${(totalDmg/100000).toFixed(1)}L`} sub="aggregate estimated damage" color="#34d399" />
          <StatCard label="Flagged" value={flagged} sub="investigation required" color="#f97316" />
          <StatCard label="Incomplete" value={missing} sub="missing mandatory fields" color="#fbbf24" />
        </div>

        {/* Route Distribution */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Route Distribution</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(routeCounts).map(([route, count]) => {
              const c = ROUTE_CONFIG[route];
              return (
                <div key={route} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold"
                  style={{ borderColor: c?.color, color: c?.color, background: c?.bg }}>
                  {c?.icon} {route} <span className="ml-1 opacity-70">× {count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Claims List */}
          <div className="lg:col-span-2 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold px-1">Claims Queue</p>
            {CLAIMS_DATA.map((c, i) => (
              <ClaimCard key={i} claim={c} isSelected={selected === i} onClick={() => { setSelected(i); setTab("fields"); }} />
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3 rounded-xl border bg-gray-900 overflow-hidden" style={{ borderColor: cfg.color + "50" }}>
            {/* Detail Header */}
            <div className="p-4 border-b border-gray-800 flex items-start justify-between gap-3" style={{ background: cfg.bg }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-gray-500">{claim.document}</span>
                  <Badge route={claim.recommendedRoute} />
                </div>
                <p className="text-lg font-black">{claim.extractedFields.policyholder_name}</p>
                <PipelineViz route={claim.recommendedRoute} />
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black" style={{ color: cfg.color }}>
                  {claim.extractedFields.estimated_damage_inr ? fmtInr(claim.extractedFields.estimated_damage_inr) : "—"}
                </p>
                <p className="text-xs text-gray-500">estimated damage</p>
              </div>
            </div>

            {/* Reasoning Box */}
            <div className="mx-4 mt-4 rounded-lg border p-3" style={{ borderColor: cfg.color + "40", background: cfg.bg }}>
              <p className="text-xs font-bold mb-1" style={{ color: cfg.color }}>⚙ AGENT REASONING</p>
              <p className="text-xs text-gray-300 leading-relaxed">{claim.reasoning}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 mt-4 px-4">
              {["fields", "missing", "attachments"].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${tab === t ? "border-blue-500 text-blue-400" : "border-transparent text-gray-600 hover:text-gray-400"}`}>
                  {t === "missing" ? `Missing (${claim.missingFields.length})` : t}
                </button>
              ))}
            </div>

            <div className="p-4 max-h-72 overflow-y-auto">
              {tab === "fields" && <FieldGrid fields={claim.extractedFields} />}
              {tab === "missing" && (
                claim.missingFields.length === 0
                  ? <p className="text-sm text-emerald-400 font-semibold">✓ All mandatory fields are present.</p>
                  : <div className="space-y-2">
                    {claim.missingFields.map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs">
                        <span className="text-amber-500">⚠</span>
                        <span className="font-mono text-amber-300 bg-amber-900/30 border border-amber-800 px-2 py-0.5 rounded">{f}</span>
                        <span className="text-gray-600">— required, not provided</span>
                      </div>
                    ))}
                  </div>
              )}
              {tab === "attachments" && (
                <div className="space-y-2">
                  {(claim.extractedFields.attachments || []).map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-blue-400">📎</span>
                      <span className="font-mono text-gray-200">{a}</span>
                    </div>
                  ))}
                  {(!claim.extractedFields.attachments || claim.extractedFields.attachments.length === 0) && (
                    <p className="text-xs text-gray-600 italic">No attachments listed.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 py-4">
        <p className="text-center text-xs text-gray-700">FNOL Claims Processing Agent · Powered by Claude Sonnet · 5 claims processed</p>
      </div>
    </div>
  );
}
