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
  AlertCircle
} from "lucide-react";

// Dashboard metrikleri için başlangıç verileri
const defaultDashboardData = {
  investmentMobilised: "€25.2 bn",
  multiplier: "x3.0",
  allocations: [
    { label: "Funds Allocated", percent: 88.3, value: "€8.4 bn", color: "bg-indigo-600" },
    { label: "Programmes signed", percent: 44.2, value: "€4.2 bn", color: "bg-blue-500" },
    { label: "Guarantees deployed", percent: 39.4, value: "€2.7 bn", color: "bg-cyan-600" },
    { label: "Remaining funds", percent: 11.7, value: "€1.1 bn", color: "bg-amber-400" },
  ],
  targets: [
    { label: "Green Target", actual: 32.7, target: 20, color: "bg-emerald-500" },
    { label: "SME Target", actual: 9.3, target: 15, color: "bg-amber-500" },
  ],
  eu: { public: 57, private: 43 },
  lastUpdated: "16 April 2026"
};

// Bütçe Tablosu verileri (Banking Call verileri dahil)
const defaultTableData = [
  { id: 1, label: "1. UIF BUDGET", guarantees: 7800.00, grants: 1741.00, multiplier: null, totalInvestments: null, type: 'header' },
  { id: 2, label: "2. TOP-UPS", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 3, label: "Total available", guarantees: 990.00, grants: 412.38, multiplier: null, totalInvestments: null, type: 'indent-1-italic' },
  { id: 4, label: "↳ Top-ups (contracted)", guarantees: 990.00, grants: 412.38, multiplier: 4.54, totalInvestments: 6363.95, type: 'indent-2' },
  { id: 6, label: "3. EIB EXCLUSIVE WINDOW", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 8, label: "↳ EIB exclusive window (assigned)", guarantees: 2378.64, grants: 149.75, multiplier: 1.22, totalInvestments: 3076.66, type: 'indent-2' },
  { id: 9, label: "4. OPEN CALL", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 11, label: "↳ Open call (allocated)", guarantees: 2985.50, grants: 810.49, multiplier: 3.14, totalInvestments: 11905.07, type: 'indent-2' },
  { id: 12, label: "↳ Open call (contracted)", guarantees: 844.50, grants: 88.04, multiplier: 2.79, totalInvestments: 2599.93, type: 'indent-2' },
  { id: 13, label: "↳ Open call (approved)", guarantees: 2141.00, grants: 722.45, multiplier: 3.25, totalInvestments: 9305.14, type: 'indent-2' },
  { id: 16, label: "5. BANKING CALL", guarantees: null, grants: null, multiplier: null, totalInvestments: null, type: 'group' },
  { id: 17, label: "↳ Banking Call (contracted)", guarantees: 131.00, grants: 6.46, multiplier: 2.87, totalInvestments: 394.02, type: 'indent-2' },
  { id: 18, label: "↳ Banking Call (approved)", guarantees: 145.00, grants: 14.77, multiplier: 2.81, totalInvestments: 448.97, type: 'indent-2' },
  { id: 14, label: "TOTAL ALLOCATED AMOUNT", guarantees: 6354.14, grants: 1372.63, multiplier: 3.20, totalInvestments: 21345.68, type: 'summary-allocated' },
  { id: 15, label: "TOTAL UNALLOCATED AMOUNT", guarantees: 1445.86, grants: 368.37, multiplier: null, totalInvestments: null, type: 'summary-unallocated' }
];

export default function App() {
  const [isDashboardCMSOpen, setIsDashboardCMSOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [dashboardData, setDashboardData] = useState(() => {
    const saved = localStorage.getItem("uif-dashboard-data");
    return saved ? JSON.parse(saved) : defaultDashboardData;
  });

  const [tableData, setTableData] = useState(() => {
    const saved = localStorage.getItem("uif-table-data");
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
    localStorage.setItem("uif-dashboard-data", JSON.stringify(tempDashboard));
    localStorage.setItem("uif-table-data", JSON.stringify(tempTable));
    setIsDashboardCMSOpen(false);
    setIsBudgetEditing(false);
  };

  const formatNum = (num) => {
    // NaN kontrolü ekleyerek formatlama hatalarını önle
    if (num === null || num === undefined || isNaN(num) || num === "") return "—";
    return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-slate-100 min-h-screen p-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow border overflow-hidden">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b bg-white">
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-sm">
            <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">Investment Expected to be Mobilised</p>
            <h2 className="text-4xl font-bold">{dashboardData.investmentMobilised}</h2>
          </div>

          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm">
            <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">Multiplier</p>
            <h2 className="text-4xl font-bold">{dashboardData.multiplier}</h2>
          </div>
        </div>

        {/* FUNDS OVERVIEW */}
        <div className="px-6 pb-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-800">
              <Wallet size={18} className="text-blue-600"/> UIF Funds Overview
            </h3>

            {[...dashboardData.allocations.slice(0, 1), ...(showMore ? dashboardData.allocations.slice(1) : [])].map((item, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.value} <span className="text-slate-400">({item.percent}%)</span></span>
                </div>

                <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: (item.percent || 0) + "%" }} />
                </div>
              </div>
            ))}

            <button 
              onClick={() => setShowMore(!showMore)} 
              className="mt-4 text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"
            >
              {showMore ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              {showMore ? "SHOW LESS" : "SHOW MORE"}
            </button>
          </div>
        </div>

        {/* TARGETS & PIE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-8 flex items-center gap-2 text-slate-800">
              <Target size={18} className="text-rose-600"/> Progress towards targets
            </h3>

            <div className="px-6"> {/* Padding artırılarak balonların kenara çarpması önlendi */}
              {dashboardData.targets.map((t, i) => {
                const progress = Math.min((t.actual / (t.target || 1)) * 100, 100);
                return (
                  <div key={i} className="mb-14 last:mb-4">
                    <div className="flex justify-between text-sm mb-6 font-semibold text-slate-700">
                      <span>{t.label}</span>
                    </div>
                    <div className="relative bg-slate-100 h-2 rounded-full">
                      {/* Bar görselleştirmesi */}
                      <div className={`${t.color} h-2 rounded-full transition-all duration-500`} style={{ width: `calc(${progress}% - 12px)` }} />
                      
                      {/* Overlay konumu: Kenar marjı artırılarak çerçeveye yapışması önlendi */}
                      <div 
                        className="absolute -top-8 text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-white rounded shadow-sm z-10 whitespace-nowrap" 
                        style={{ 
                          left: `calc(${progress}% - 12px)`, 
                          transform: "translateX(-50%)" 
                        }}
                      >
                        {t.actual}%
                      </div>
                      
                      <div className="absolute -top-1 w-[2px] h-4 bg-slate-900" style={{ left: i === 1 ? "100%" : t.target + "%" }} />
                      <div className="absolute top-4 text-[9px] font-bold text-slate-400" style={{ left: i === 1 ? "100%" : t.target + "%", transform: i === 1 ? "translateX(-100%)" : "translateX(-50%)" }}>
                        TARGET: {t.target}%
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
              <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#3b82f6 0% ${dashboardData.eu.public}%, #f43f5e ${dashboardData.eu.public}% 100%)` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white w-28 h-28 rounded-full shadow-inner flex flex-col items-center justify-center">
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-8 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"/>
                <span className="text-slate-600">Public ({dashboardData.eu.public}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"/>
                <span className="text-slate-600">Private ({dashboardData.eu.private}%)</span>
              </div>
            </div>
          </div>
        </div>

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 md:p-10 z-50">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold uppercase text-slate-800 tracking-tight">UIF Budget Overview</h2>
              <div className="flex gap-3">
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
                    const grandTotal = (row.guarantees || 0) + (row.grants || 0);
                    const hasValues = row.guarantees !== null || row.grants !== null;
                    return (
                      <tr key={index} className={`hover:bg-slate-50/50 transition ${row.type === 'header' ? 'bg-slate-100/80 font-bold text-slate-900' : ''} ${row.type === 'group' ? 'bg-slate-50/50 font-semibold text-slate-800' : ''} ${row.type === 'summary-allocated' ? 'bg-slate-800 text-white font-bold' : ''} ${row.type === 'summary-unallocated' ? 'font-bold' : ''}`}>
                        <td className={`p-2 ${row.type === 'indent-1-italic' ? 'pl-8 italic text-slate-500' : row.type === 'indent-2' ? 'pl-12 text-slate-500' : ''}`}>
                          {isBudgetEditing ? (
                            <input className="w-full bg-transparent border-b border-blue-200 outline-none focus:border-blue-500 text-slate-900" value={row.label || ""} onChange={(e) => {const newTable = [...tempTable]; newTable[index].label = e.target.value; setTempTable(newTable);}} />
                          ) : row.label}
                        </td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" className="w-24 bg-blue-50/30 border border-blue-100 rounded px-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-slate-800" value={isNaN(row.guarantees) ? "" : row.guarantees || 0} onChange={(e) => {const newTable = [...tempTable]; newTable[index].guarantees = parseFloat(e.target.value) || 0; setTempTable(newTable);}} />) : formatNum(row.guarantees)}</td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" className="w-24 bg-blue-50/30 border border-blue-100 rounded px-1 text-right focus:ring-1 focus:ring-blue-400 outline-none text-slate-800" value={isNaN(row.grants) ? "" : row.grants || 0} onChange={(e) => {const newTable = [...tempTable]; newTable[index].grants = parseFloat(e.target.value) || 0; setTempTable(newTable);}} />) : formatNum(row.grants)}</td>
                        <td className={`p-3 text-right font-bold ${row.type === 'summary-allocated' ? 'text-blue-300' : (row.type === 'summary-unallocated' ? 'text-red-600 bg-red-50' : 'text-blue-800 bg-blue-50/20')}`}>{hasValues ? formatNum(grandTotal) : "—"}</td>
                        <td className="p-2 text-right">{isBudgetEditing ? (<input type="number" step="0.01" className="w-16 bg-emerald-50/30 border border-emerald-100 rounded px-1 text-right focus:ring-1 focus:ring-emerald-400 outline-none text-slate-800" value={isNaN(row.multiplier) ? "" : row.multiplier || 0} onChange={(e) => {const newTable = [...tempTable]; newTable[index].multiplier = parseFloat(e.target.value) || 0; setTempTable(newTable);}} />) : (row.multiplier ? `${row.multiplier}x` : "—")}</td>
                        <td className="p-2 text-right font-semibold">{isBudgetEditing ? (<input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded px-1 text-right focus:ring-1 focus:ring-slate-400 outline-none text-slate-800" value={isNaN(row.totalInvestments) ? "" : row.totalInvestments || 0} onChange={(e) => {const newTable = [...tempTable]; newTable[index].totalInvestments = parseFloat(e.target.value) || 0; setTempTable(newTable);}} />) : formatNum(row.totalInvestments)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t bg-slate-50 text-[10px] text-slate-400 italic">
              <span>* All values are in EUR million.</span>
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD CMS MODAL --- */}
      {isDashboardCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-8 w-full max-w-3xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-2xl text-slate-800">Dashboard CMS</h2>
              <button onClick={() => setIsDashboardCMSOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X/></button>
            </div>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Expected Mobilised</label>
                  <input className="border-2 p-3 w-full rounded-xl focus:border-blue-500 outline-none" value={tempDashboard.investmentMobilised} onChange={(e)=>setTempDashboard({...tempDashboard, investmentMobilised:e.target.value})}/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Main Multiplier</label>
                  <input className="border-2 p-3 w-full rounded-xl focus:border-blue-500 outline-none" value={tempDashboard.multiplier} onChange={(e)=>setTempDashboard({...tempDashboard, multiplier:e.target.value})}/>
                </div>
              </div>

              {/* Allocations CMS Section */}
              <div className="border-t pt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Allocations Overview</label>
                <div className="space-y-3">
                  {tempDashboard.allocations.map((a, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg">
                      <div className="col-span-5">
                        <input className="w-full border p-2 rounded text-xs" value={a.label} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].label = e.target.value; setTempDashboard({...tempDashboard, allocations: arr});
                        }} />
                      </div>
                      <div className="col-span-4">
                        <input className="w-full border p-2 rounded text-xs" value={a.value} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].value = e.target.value; setTempDashboard({...tempDashboard, allocations: arr});
                        }} />
                      </div>
                      <div className="col-span-3">
                        <input className="w-full border p-2 rounded text-xs" type="number" value={isNaN(a.percent) ? "" : a.percent || 0} onChange={(e) => {
                          const arr = [...tempDashboard.allocations]; arr[i].percent = parseFloat(e.target.value) || 0; setTempDashboard({...tempDashboard, allocations: arr});
                        }} />
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
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg">
                      <div className="col-span-6 font-semibold text-slate-600 px-2">{t.label}</div>
                      <div className="col-span-3">
                        <label className="text-[8px] block uppercase text-slate-400">Actual</label>
                        <input className="w-full border p-1.5 rounded text-xs" type="number" step="0.1" value={isNaN(t.actual) ? "" : t.actual || 0} onChange={(e) => {
                          const arr = [...tempDashboard.targets]; arr[i].actual = parseFloat(e.target.value) || 0; setTempDashboard({...tempDashboard, targets: arr});
                        }} />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[8px] block uppercase text-slate-400">Target</label>
                        <input className="w-full border p-1.5 rounded text-xs" type="number" step="1" value={isNaN(t.target) ? "" : t.target || 0} onChange={(e) => {
                          const arr = [...tempDashboard.targets]; arr[i].target = parseFloat(e.target.value) || 0; setTempDashboard({...tempDashboard, targets: arr});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EU Share & Date CMS Section */}
              <div className="border-t pt-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">EU Share (Public %)</label>
                  <input className="border p-2 w-full rounded-lg text-sm" type="number" value={isNaN(tempDashboard.eu.public) ? "" : tempDashboard.eu.public || 0} onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0; setTempDashboard({...tempDashboard, eu: { public: val, private: Math.max(0, 100 - val) }});
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