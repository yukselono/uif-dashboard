import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Settings,
  Save,
  Wallet,
  Target,
  PieChart,
  ChevronDown,
  ChevronUp,
  Edit3,
  X,
  Plus,
  AlertCircle,
  Download,
  Info,
  Building,
  Users,
  BarChart3
} from "lucide-react";

// Dashboard metrikleri için başlangıç verileri (Pie Chart ve EIB Eklentisi)
const defaultDashboardData = {
  investmentMobilised: "€25.2 bn",
  investmentMobilisedInfo: "Total estimated investments expected to be mobilised by UIF guarantees and grants.",
  multiplier: "x3.0",
  multiplierInfo: "Ratio of total expected investments to the total UIF contribution.",
  fundsTotals: { guarantees: "€7.8 bn", grants: "€1.74 bn" },
  allocations: [
    { label: "Funds Allocated", percent: 88.3, value: "€8.4 bn", color: "bg-indigo-600", info: "Total budget allocated to specific programmes out of the overall UIF budget." },
    { label: "Programmes signed", percent: 44.2, value: "€4.2 bn", color: "bg-blue-500", info: "Value of programmes that have been officially signed with implementing partners." },
    { label: "Guarantees deployed", percent: 39.4, value: "€2.7 bn", color: "bg-cyan-600", info: "Amount of guarantees effectively deployed to final beneficiaries." },
    { label: "Remaining funds", percent: 11.7, value: "€1.1 bn", color: "bg-amber-400", info: "Budget currently unallocated and available for future calls." },
  ],
  targets: [
    { label: "Green Target", actual: 32.7, target: 20, color: "bg-emerald-500", info: "Percentage of investments contributing to climate and green transition objectives." },
    { label: "SME Target", actual: 9.3, target: 15, color: "bg-amber-500", info: "Percentage of investments specifically targeting Small and Medium-sized Enterprises." },
  ],
  eu: { public: 57, private: 43 },
  partners: {
    distribution: [
      { label: "MDBs", percent: 35, value: "€...", color: "bg-blue-600", hex: "#2563eb" },
      { label: "European DFIs", percent: 15, value: "€...", color: "bg-emerald-500", hex: "#10b981" },
      { label: "EIB", percent: 50, value: "€...", color: "bg-amber-500", hex: "#f59e0b" }
    ],
    list: [
      "EBRD (MDB)",
      "CEB (MDB)",
      "IFC (MDB)",
      "EIB",
      "BGK (European DFI)",
      "CDP (European DFI)",
      "COFIDES (European DFI)",
      "KfW (European DFI)"
    ]
  },
  lastUpdated: "16 April 2026"
};

// Bütçe Tablosu verileri
const defaultTableData = [
  { id: 1, label: "1. UIF BUDGET", guarantees: 7800.00, grants: 1741.00, multiplier: null, totalInvestments: null, type: 'header' },
  { id: 2, label: "2. TOP-UPS", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 4, label: "↳ Top-ups (contracted)", guarantees: 990.00, grants: 412.38, multiplier: 4.54, totalInvestments: 6363.95, type: 'indent-2' },
  { id: 6, label: "3. EIB EXCLUSIVE WINDOW", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 8, label: "↳ EIB exclusive window (assigned)", guarantees: 2378.64, grants: 149.75, multiplier: 1.22, totalInvestments: 3076.66, type: 'indent-2' },
  { id: 99, label: "↳ EIB Jumbo", guarantees: 428.60, grants: 149.80, multiplier: 1.10, totalInvestments: 633.30, type: 'indent-2' },
  { id: 9, label: "4. OPEN CALL", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 11, label: "↳ Open call (allocated)", guarantees: 2985.50, grants: 810.49, multiplier: 3.14, totalInvestments: 11905.07, type: 'indent-2' },
  { id: 12, label: "↳ Open call (contracted)", guarantees: 844.50, grants: 88.04, multiplier: 2.79, totalInvestments: 2599.93, type: 'indent-2' },
  { id: 16, label: "5. BANKING CALL", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 161, label: "↳ Banking Call (Allocated)", guarantees: 525.00, grants: 170.20, multiplier: 5.60, totalInvestments: 3925.90, type: 'indent-2' },
  { id: 17, label: "↳ Banking Call (contracted)", guarantees: 0, grants: 0, multiplier: 0, totalInvestments: 0, type: 'indent-2' },
  { id: 14, label: "TOTAL ALLOCATED AMOUNT", guarantees: 6354.14, grants: 1372.63, multiplier: 3.20, totalInvestments: 21345.68, type: 'summary-allocated' },
  { id: 100, label: "TOTAL CONTRACTED", guarantees: 3784.50, grants: 477.30, multiplier: null, totalInvestments: 6653.80, type: 'summary-allocated' },
  { id: 15, label: "TOTAL UNALLOCATED AMOUNT", guarantees: 1445.86, grants: 368.37, multiplier: null, totalInvestments: null, type: 'summary-unallocated' }
];

export default function App() {
  const [isDashboardCMSOpen, setIsDashboardCMSOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  
  // Single global toggle for everything
  const [showDetails, setShowDetails] = useState(false);

  // Veri çakışmasını temizlemek için key isimleri 'v6' ile değiştirildi
  const [dashboardData, setDashboardData] = useState(() => {
    const saved = localStorage.getItem("uif-dashboard-data-v6");
    return saved ? JSON.parse(saved) : defaultDashboardData;
  });

  const [tableData, setTableData] = useState(() => {
    const saved = localStorage.getItem("uif-table-data-v6");
    return saved ? JSON.parse(saved) : defaultTableData;
  });

  const [tempDashboard, setTempDashboard] = useState(dashboardData);
  const [tempTable, setTempTable] = useState(tableData);

  const openDashboardCMS = () => {
    setTempDashboard(JSON.parse(JSON.stringify(dashboardData))); // Deep copy
    setIsDashboardCMSOpen(true);
  };

  const handleSaveAll = () => {
    setDashboardData(tempDashboard);
    setTableData(tempTable);
    localStorage.setItem("uif-dashboard-data-v6", JSON.stringify(tempDashboard));
    localStorage.setItem("uif-table-data-v6", JSON.stringify(tempTable));
    setIsDashboardCMSOpen(false);
    setIsBudgetEditing(false);
  };

  const exportToCSV = () => {
    const headers = ["Label", "Guarantees", "Grants", "Grand Total", "Multiplier", "Total Investments"];
    const rows = tableData.map(row => {
      const grandTotal = (Number(row.guarantees) || 0) + (Number(row.grants) || 0);
      const hasValues = row.guarantees !== null || row.grants !== null;
      return [
        `"${row.label}"`,
        row.guarantees ?? "",
        row.grants ?? "",
        hasValues ? grandTotal.toFixed(2) : "",
        row.multiplier ?? "",
        row.totalInvestments ?? ""
      ].join(",");
    });
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "uif-budget-overview.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNum = (num) => {
    const safeNum = Number(num);
    if (num === null || num === undefined || isNaN(safeNum) || num === "") return "—";
    return safeNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Ortaklar Pie Chart Gradient Hesaplayıcı
  const getPartnerGradient = () => {
    let currentPercent = 0;
    const dists = dashboardData.partners?.distribution || [];
    const parts = dists.map(d => {
      const start = currentPercent;
      currentPercent += (Number(d.percent) || 0);
      return `${d.hex || '#ccc'} ${start}% ${currentPercent}%`;
    });
    if (currentPercent < 100) {
      parts.push(`#e2e8f0 ${currentPercent}% 100%`); // Kalan kısım gri
    }
    return `conic-gradient(${parts.join(', ')})`;
  };

  // Tekrar kullanılabilir Tooltip Component'i
  const Tooltip = ({ text, children }) => (
    <div className="group relative inline-flex items-center">
      {children}
      {text && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl z-50 text-center font-normal whitespace-normal pointer-events-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-800">
          {text}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow border overflow-clip relative">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b bg-white relative z-20">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">UIF Data Dashboard</h1>
            <p className="text-slate-500">
              Tracking the progress of deployment of the Ukraine Investment Framework
            </p>
          </div>
          <button 
            onClick={openDashboardCMS} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 transition rounded-xl border text-sm font-semibold"
          >
            <Settings size={16}/> Manage Dashboard
          </button>
        </div>

        {/* TOP METRICS */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-sm relative">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-wider font-bold opacity-80 text-blue-100">Investment Expected to be Mobilised</p>
              <Tooltip text={dashboardData.investmentMobilisedInfo}>
                <Info size={14} className="text-blue-200 cursor-help opacity-70 hover:opacity-100 transition" />
              </Tooltip>
            </div>
            <h2 className="text-4xl font-bold">{dashboardData.investmentMobilised}</h2>
          </div>

          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm relative">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-wider font-bold opacity-80 text-emerald-100">Multiplier</p>
              <Tooltip text={dashboardData.multiplierInfo}>
                <Info size={14} className="text-emerald-200 cursor-help opacity-70 hover:opacity-100 transition" />
              </Tooltip>
            </div>
            <h2 className="text-4xl font-bold">{dashboardData.multiplier}</h2>
          </div>
        </div>

        {/* FUNDS OVERVIEW */}
        <div className="px-6 relative z-10">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-800">
                <Wallet size={18} className="text-blue-600"/> UIF Funds Overview
              </h3>
              
              <div className="flex flex-wrap gap-3">
                <div className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-sm">
                  <span className="text-slate-400 mr-2 uppercase text-[10px]">Total Guarantees</span> 
                  {dashboardData.fundsTotals?.guarantees || "€7.8 bn"}
                </div>
                <div className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-sm">
                  <span className="text-slate-400 mr-2 uppercase text-[10px]">Total Grants</span> 
                  {dashboardData.fundsTotals?.grants || "€1.74 bn"}
                </div>
              </div>
            </div>

            {[...dashboardData.allocations.slice(0, 1), ...(showDetails ? dashboardData.allocations.slice(1) : [])].map((item, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    <Tooltip text={item.info}>
                      <Info size={14} className="text-slate-300 cursor-help hover:text-slate-500 transition" />
                    </Tooltip>
                  </span>
                  <span>{item.value} <span className="text-slate-400">({Number(item.percent) || 0}%)</span></span>
                </div>

                <div className="bg-slate-100 h-3 rounded-full overflow-hidden w-full">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${Number(item.percent) || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Show/Hide Button for Detail Charts and Allocations */}
        <div className="px-6 py-6 relative z-10 flex justify-center">
           <button 
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white border hover:bg-slate-50 transition px-8 py-3 rounded-full text-sm font-bold shadow-sm flex items-center gap-2 text-slate-600 active:scale-95"
           >
              {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              {showDetails ? "Show less" : "Show more"}
           </button>
        </div>

        {/* ADVANCED CHARTS SECTION (Hidden by default) */}
        {showDetails && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {/* TARGETS & PIE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 relative z-0">
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-10 flex items-center gap-2 text-slate-800">
                  <Target size={18} className="text-rose-600"/> Progress towards targets
                </h3>

                <div className="px-4">
                  {dashboardData.targets.map((t, i) => {
                    const actualVal = Number(t.actual) || 0;
                    const targetVal = Number(t.target) || 1; 
                    const maxVal = Math.max(actualVal, targetVal);
                    const actualPercent = Math.min((actualVal / maxVal) * 100, 100);
                    const targetPercent = Math.min((targetVal / maxVal) * 100, 100);

                    return (
                      <div key={i} className="mb-14 last:mb-4">
                        <div className="flex justify-between text-sm mb-6 font-semibold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            {t.label}
                            <Tooltip text={t.info}>
                              <Info size={14} className="text-slate-300 cursor-help hover:text-slate-500 transition" />
                            </Tooltip>
                          </span>
                        </div>
                        <div className="relative bg-slate-100 h-2 rounded-full w-full">
                          <div className={`${t.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${actualPercent}%` }} />
                          
                          <div 
                            className="absolute -top-8 text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-white rounded shadow-sm whitespace-nowrap" 
                            style={{ left: `${actualPercent}%`, transform: "translateX(-50%)" }}
                          >
                            {actualVal}%
                          </div>
                          
                          <div 
                            className="absolute -top-1 w-[2px] h-4 bg-slate-900" 
                            style={{ left: `${targetPercent}%`, transform: "translateX(-50%)" }} 
                          />
                          <div 
                            className="absolute top-4 text-[9px] font-bold text-slate-400 whitespace-nowrap" 
                            style={{ left: `${targetPercent}%`, transform: targetPercent > 90 ? "translateX(-100%)" : "translateX(-50%)" }}
                          >
                            TARGET: {targetVal}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6 text-center shadow-sm">
                <h3 className="font-bold mb-6 flex justify-center items-center gap-2 text-slate-800">
                  <PieChart size={18} className="text-indigo-600"/> Share of EU Contribution
                </h3>

                <div className="relative w-44 h-44 mx-auto">
                  <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#3b82f6 0% ${Number(dashboardData.eu.public) || 0}%, #f43f5e ${Number(dashboardData.eu.public) || 0}% 100%)` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white w-28 h-28 rounded-full shadow-inner flex flex-col items-center justify-center">
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-6 mt-8 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"/>
                    <span className="text-slate-600">Public ({Number(dashboardData.eu.public) || 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"/>
                    <span className="text-slate-600">Private ({Number(dashboardData.eu.private) || 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPLEMENTING PARTNERS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6 relative z-0">
              
              {/* MDB vs DFI vs EIB Distribution (Now as Pie Chart) */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <PieChart size={18} className="text-blue-600"/> Overview of Funds per Partner Type
                </h3>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
                  {/* Pie Chart */}
                  <div className="relative w-44 h-44 shrink-0">
                    <div 
                      className="w-full h-full rounded-full" 
                      style={{ background: getPartnerGradient() }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white w-28 h-28 rounded-full shadow-inner" />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 w-full max-w-[200px] space-y-4">
                    {dashboardData.partners?.distribution.map((dist, i) => (
                      <div key={i} className="flex justify-between items-center text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${dist.color}`} />
                          <span className="whitespace-nowrap">{dist.label}</span>
                        </div>
                        <span className="font-bold ml-3">{Number(dist.percent) || 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* List of Partners */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 shrink-0">
                  <Users size={18} className="text-emerald-600"/> List of Implementing Partners
                </h3>
                <div className="bg-slate-50 border rounded-xl p-4 flex-1 overflow-y-auto">
                  <ul className="space-y-2">
                    {dashboardData.partners?.list.map((partner, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{partner}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="p-6 border-t bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs font-medium text-slate-400">
            LAST UPDATED: {dashboardData.lastUpdated}
          </span>

          <div className="flex gap-4">
            <a href="https://uif.eu/programmes.html" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md">
              Explore Projects
            </a>

            <button onClick={() => setIsBudgetModalOpen(true)} className="bg-white border hover:bg-slate-50 transition px-6 py-2 rounded-xl text-sm font-bold shadow-sm">
              View Summary UIF Budget
            </button>
          </div>
        </div>
      </div>

      {/* --- BUDGET TABLE MODAL --- */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 md:p-10 z-[100]">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold uppercase text-slate-800 tracking-tight">UIF Budget Overview</h2>
              <div className="flex gap-3">
                <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition rounded-xl text-xs font-bold">
                  <Download size={14}/> Export CSV
                </button>
                {!isBudgetEditing ? (
                  <button onClick={() => {setTempTable(tableData); setIsBudgetEditing(true);}} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition rounded-xl text-xs font-bold">
                    <Edit3 size={14}/> Edit Values
                  </button>
                ) : (
                  <button onClick={handleSaveAll} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition rounded-xl text-xs font-bold shadow-lg">
                    <Save size={14}/> Save Changes
                  </button>
                )}
                <button onClick={() => {setIsBudgetModalOpen(false); setIsBudgetEditing(false);}} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 text-slate-500 uppercase tracking-widest font-bold">
                    <th className="p-4 text-left w-1/3 text-slate-400">[EUR million]</th>
                    <th className="p-4 text-right">Guarantees</th>
                    <th className="p-4 text-right">Grants</th>
                    <th className="p-4 text-right text-blue-700">Grand Total</th>
                    <th className="p-4 text-right">Multiplier</th>
                    <th className="p-4 text-right">Total investments</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {(isBudgetEditing ? tempTable : tableData).map((row, index) => {
                    const grandTotal = (Number(row.guarantees) || 0) + (Number(row.grants) || 0);
                    const hasValues = row.guarantees !== null || row.grants !== null;
                    return (
                      <tr key={index} className={`hover:bg-slate-50/50 transition ${row.type === 'header' ? 'bg-slate-100/80 font-bold text-slate-900' : ''} ${row.type === 'group' ? 'bg-slate-50/50 font-semibold text-slate-800' : ''} ${row.type === 'summary-allocated' ? 'bg-slate-800 text-white font-bold' : ''} ${row.type === 'summary-unallocated' ? 'font-bold' : ''}`}>
                        <td className={`p-2 ${row.type === 'indent-1-italic' ? 'pl-8 italic text-slate-500' : row.type === 'indent-2' ? 'pl-12 text-slate-500' : ''}`}>
                          {isBudgetEditing ? (
                            <input className={`w-full bg-transparent border-b border-blue-200 outline-none focus:border-blue-500 ${row.type === 'summary-allocated' ? 'text-white' : 'text-slate-900'}`} value={row.label || ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].label = e.target.value; setTempTable(newTable);}} />
                          ) : row.label}
                        </td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" className="w-24 bg-blue-50/30 border border-blue-100 rounded px-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-slate-800" value={row.guarantees ?? ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].guarantees = e.target.value === "" ? null : parseFloat(e.target.value); setTempTable(newTable);}} />) : formatNum(row.guarantees)}</td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" className="w-24 bg-blue-50/30 border border-blue-100 rounded px-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-slate-800" value={row.grants ?? ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].grants = e.target.value === "" ? null : parseFloat(e.target.value); setTempTable(newTable);}} />) : formatNum(row.grants)}</td>
                        <td className={`p-3 text-right font-bold ${row.type === 'summary-allocated' ? 'text-blue-300' : (row.type === 'summary-unallocated' ? 'text-red-600 bg-red-50' : 'text-blue-800 bg-blue-50/20')}`}>{hasValues ? formatNum(grandTotal) : "—"}</td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" step="0.01" className="w-16 bg-emerald-50/30 border border-emerald-100 rounded px-1 text-right focus:ring-1 focus:ring-emerald-400 outline-none text-slate-800" value={row.multiplier ?? ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].multiplier = e.target.value === "" ? null : parseFloat(e.target.value); setTempTable(newTable);}} />) : (row.multiplier ? `${row.multiplier}x` : "—")}</td>
                        <td className="p-2 text-right font-semibold">{isBudgetEditing ? (<input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded px-1 text-right focus:ring-1 focus:ring-slate-400 outline-none text-slate-800" value={row.totalInvestments ?? ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].totalInvestments = e.target.value === "" ? null : parseFloat(e.target.value); setTempTable(newTable);}} />) : formatNum(row.totalInvestments)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t bg-slate-50 text-[10px] text-slate-400 italic flex justify-between">
              <span>* All values are in EUR million. Download button provides CSV format compatible with Excel.</span>
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD CMS MODAL --- */}
      {isDashboardCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-[100]">
          <div className="bg-white p-8 w-full max-w-4xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-2xl text-slate-800">Dashboard CMS</h2>
              <button onClick={() => setIsDashboardCMSOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X/></button>
            </div>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded-xl bg-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Expected Mobilised</label>
                  <input className="border p-2 w-full rounded mb-2 text-sm" value={tempDashboard.investmentMobilised} onChange={(e)=>setTempDashboard({...tempDashboard, investmentMobilised:e.target.value})}/>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tooltip Info</label>
                  <input className="border p-2 w-full rounded text-xs text-slate-500" value={tempDashboard.investmentMobilisedInfo} onChange={(e)=>setTempDashboard({...tempDashboard, investmentMobilisedInfo:e.target.value})}/>
                </div>
                <div className="border p-4 rounded-xl bg-slate-50">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Main Multiplier</label>
                  <input className="border p-2 w-full rounded mb-2 text-sm" value={tempDashboard.multiplier} onChange={(e)=>setTempDashboard({...tempDashboard, multiplier:e.target.value})}/>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tooltip Info</label>
                  <input className="border p-2 w-full rounded text-xs text-slate-500" value={tempDashboard.multiplierInfo} onChange={(e)=>setTempDashboard({...tempDashboard, multiplierInfo:e.target.value})}/>
                </div>
              </div>

              {/* Funds Totals CMS */}
              <div className="border-t pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Funds Overview Reference Totals</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Total Guarantees</label>
                    <input className="border p-2 w-full rounded text-sm" value={tempDashboard.fundsTotals.guarantees} onChange={(e)=>setTempDashboard({...tempDashboard, fundsTotals: {...tempDashboard.fundsTotals, guarantees: e.target.value}})}/>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Total Grants</label>
                    <input className="border p-2 w-full rounded text-sm" value={tempDashboard.fundsTotals.grants} onChange={(e)=>setTempDashboard({...tempDashboard, fundsTotals: {...tempDashboard.fundsTotals, grants: e.target.value}})}/>
                  </div>
                </div>
              </div>

              {/* Allocations CMS Section */}
              <div className="border-t pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Allocations Overview</label>
                <div className="space-y-3">
                  {tempDashboard.allocations.map((a, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded-lg border">
                      <div className="col-span-5 space-y-2">
                        <input className="w-full border p-1.5 rounded text-xs" value={a.label} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].label = e.target.value; setTempDashboard({...tempDashboard, allocations: arr});
                        }} placeholder="Label"/>
                        <input className="w-full border p-1.5 rounded text-[10px] text-slate-500" value={a.info || ""} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].info = e.target.value; setTempDashboard({...tempDashboard, allocations: arr});
                        }} placeholder="Tooltip info..."/>
                      </div>
                      <div className="col-span-4">
                        <input className="w-full border p-1.5 rounded text-xs" value={a.value} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].value = e.target.value; setTempDashboard({...tempDashboard, allocations: arr});
                        }} placeholder="Value"/>
                      </div>
                      <div className="col-span-3">
                        <input className="w-full border p-1.5 rounded text-xs" type="number" value={a.percent ?? ""} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].percent = e.target.value === "" ? "" : parseFloat(e.target.value); setTempDashboard({...tempDashboard, allocations: arr});
                        }} placeholder="%"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Targets CMS Section */}
              <div className="border-t pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Targets Progress (%)</label>
                <div className="space-y-3">
                  {tempDashboard.targets.map((t, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded-lg border">
                      <div className="col-span-6 space-y-2">
                         <div className="font-semibold text-slate-600 px-2 text-xs">{t.label}</div>
                         <input className="w-full border p-1.5 rounded text-[10px] text-slate-500" value={t.info || ""} onChange={(e) => {
                          const arr = [...tempDashboard.targets]; arr[i].info = e.target.value; setTempDashboard({...tempDashboard, targets: arr});
                        }} placeholder="Tooltip info..."/>
                      </div>
                      <div className="col-span-3">
                        <label className="text-[8px] block uppercase text-slate-400 mb-1">Actual</label>
                        <input className="w-full border p-1.5 rounded text-xs" type="number" step="0.1" value={t.actual ?? ""} onChange={(e) => {
                          const arr = [...tempDashboard.targets]; arr[i].actual = e.target.value === "" ? "" : parseFloat(e.target.value); setTempDashboard({...tempDashboard, targets: arr});
                        }} />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[8px] block uppercase text-slate-400 mb-1">Target</label>
                        <input className="w-full border p-1.5 rounded text-xs" type="number" step="1" value={t.target ?? ""} onChange={(e) => {
                          const arr = [...tempDashboard.targets]; arr[i].target = e.target.value === "" ? "" : parseFloat(e.target.value); setTempDashboard({...tempDashboard, targets: arr});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementing Partners CMS (Pie Chart Elements) */}
              <div className="border-t pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Implementing Partners (3 Pie Chart Elements)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600">Distribution Chart Items</label>
                    {tempDashboard.partners.distribution.map((dist, i) => (
                       <div key={i} className="bg-slate-50 p-2 rounded border grid grid-cols-3 gap-2">
                          <input className="col-span-3 border p-1 rounded text-xs" value={dist.label} onChange={(e) => {
                            const arr = [...tempDashboard.partners.distribution]; arr[i].label = e.target.value;
                            setTempDashboard({...tempDashboard, partners: {...tempDashboard.partners, distribution: arr}});
                          }} placeholder="Label (e.g. MDBs)"/>
                          <div className="col-span-2 hidden"></div> {/* Value input removed since it wasn't requested for the pie legend, keeping layout intact by using col-span-3 for label */}
                          <input className="col-span-2 border p-1 rounded text-xs" value={dist.value || ""} placeholder="Value (e.g. €1.3 bn)" onChange={(e) => {
                            const arr = [...tempDashboard.partners.distribution]; arr[i].value = e.target.value;
                            setTempDashboard({...tempDashboard, partners: {...tempDashboard.partners, distribution: arr}});
                          }}/>
                          <input className="col-span-1 border p-1 rounded text-xs" type="number" placeholder="%" value={dist.percent ?? ""} onChange={(e) => {
                            const arr = [...tempDashboard.partners.distribution]; arr[i].percent = e.target.value === "" ? "" : parseFloat(e.target.value);
                            setTempDashboard({...tempDashboard, partners: {...tempDashboard.partners, distribution: arr}});
                          }}/>
                       </div>
                    ))}
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-600 mb-2 block">Partners List (one per line)</label>
                     <textarea 
                        className="w-full border p-2 rounded text-xs h-[180px] leading-relaxed" 
                        value={tempDashboard.partners.list.join('\n')}
                        onChange={(e) => {
                           const lines = e.target.value.split('\n');
                           setTempDashboard({...tempDashboard, partners: {...tempDashboard.partners, list: lines}});
                        }}
                     />
                  </div>
                </div>
              </div>

              {/* EU Share & Date CMS Section */}
              <div className="border-t pt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">EU Share (Public %)</label>
                  <input className="border p-2 w-full rounded-lg text-sm" type="number" value={tempDashboard.eu.public ?? ""} onChange={(e) => {
                    if (e.target.value === "") {
                      setTempDashboard({...tempDashboard, eu: { public: "", private: "" }});
                    } else {
                      const val = parseFloat(e.target.value) || 0; 
                      setTempDashboard({...tempDashboard, eu: { public: val, private: Math.max(0, 100 - val) }});
                    }
                  }}/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Last Updated Date</label>
                  <input className="border p-2 w-full rounded-lg text-sm" value={tempDashboard.lastUpdated} onChange={(e)=>setTempDashboard({...tempDashboard, lastUpdated:e.target.value})}/>
                </div>
              </div>

              <div className="flex justify-end pt-6 gap-3 font-bold border-t">
                <button onClick={()=>setIsDashboardCMSOpen(false)} className="px-6 py-2 rounded-xl border text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleSaveAll} className="bg-blue-600 text-white px-8 py-2 rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center gap-2"><Save size={18}/> Save All Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}