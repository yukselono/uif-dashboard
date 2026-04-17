import React, { useState } from "react";
import {
  ArrowRight,
  Settings,
  Save,
  Wallet,
  Target,
  PieChart,
  ChevronDown,
  ChevronUp,
  Edit
} from "lucide-react";

const defaultData = {
  investmentMobilised: "€25.2 bn",
  multiplier: "x3.0",
  allocations: [
    { label: "Funds Allocated", percent: 88.3, value: "€8.4 bn", color: "bg-indigo-600" },
    { label: "Programmes signed", percent: 44.2, value: "€4.2 bn", color: "bg-blue-500" },
    { label: "Guarantees deployed", percent: 39.4, value: "€2.7 bn", color: "bg-emerald-500" },
    { label: "Remaining funds", percent: 11.7, value: "€1.1 bn", color: "bg-amber-400" },
  ],
  targets: [
    { label: "Green Target", actual: 32.7, target: 20, color: "bg-emerald-500" },
    { label: "SME Target", actual: 9.3, target: 15, color: "bg-amber-500" },
  ],
  eu: { public: 57, private: 43 },
  lastUpdated: "16 April 2026",

  // 🔥 TABLE DATA
  table: [
    ["UIF BUDGET", "7,800.00", "1,741.00", "9,541.00", "—", "—"],
    ["Top-ups", "990.00", "412.38", "1,402.38", "4.54x", "6,363.95"],
    ["↳ Top-ups (contracted)", "990.00", "412.38", "1,402.38", "4.54x", "6,363.95"],
    ["EIB exclusive window (assigned)", "2,378.64", "149.75", "2,528.39", "1.22x", "3,076.66"],
    ["Open call (allocated)", "2,985.50", "810.49", "3,795.99", "3.14x", "11,905.07"],
    ["↳ Open Call (contracted)", "844.50", "88.04", "932.54", "2.79x", "2,599.93"],
    ["↳ Open Call (approved)", "2,141.00", "722.45", "2,863.45", "3.25x", "9,305.14"]
  ]
};

export default function App() {
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isTableEdit, setIsTableEdit] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("uif-data");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    setData(editData);
    localStorage.setItem("uif-data", JSON.stringify(editData));
    setIsCMSOpen(false);
  };

  const teaser = data.allocations.slice(0, 1);
  const rest = data.allocations.slice(1);

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow border">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b">
          <div>
            <h1 className="text-3xl font-bold">UIF Data Dashboard</h1>
            <p className="text-slate-500">
              Tracking the progress of deployment of the Ukraine Investment Framework
            </p>
          </div>

          <button onClick={() => setIsCMSOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border">
            <Settings size={16}/> Manage Data (CMS)
          </button>
        </div>

        {/* TOP */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <p className="text-xs">Investment Expected to be Mobilised</p>
            <h2 className="text-3xl font-bold">{data.investmentMobilised}</h2>
          </div>

          <div className="bg-emerald-600 text-white p-6 rounded-xl">
            <p className="text-xs">Multiplier</p>
            <h2 className="text-3xl font-bold">{data.multiplier}</h2>
          </div>
        </div>

        {/* FUNDS */}
        <div className="px-6 pb-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex gap-2">
              <Wallet size={18}/> UIF Funds Overview
            </h3>

            {[...teaser, ...(showMore ? rest : [])].map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value} ({item.percent}%)</span>
                </div>

                <div className="bg-slate-200 h-3 rounded">
                  <div className={`${item.color} h-3 rounded`} style={{ width: item.percent + "%" }} />
                </div>
              </div>
            ))}

            <button onClick={() => setShowMore(!showMore)}
              className="text-sm text-blue-600 flex items-center gap-1">
              {showMore ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              {showMore ? "Show less" : "Show more"}
            </button>
          </div>
        </div>

        {/* TARGET + PIE */}
        <div className="grid grid-cols-2 gap-6 px-6 pb-6">

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex gap-2">
              <Target size={18}/> Progress towards targets
            </h3>

            {data.targets.map((t, i) => {
              const scaled = Math.min((t.actual / t.target) * 100, 100);

              return (
                <div key={i} className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t.label}</span>
                    <span>{t.actual}%</span>
                  </div>

                  <div className="relative bg-slate-200 h-2 rounded">
                    <div className={`${t.color} h-2 rounded`} style={{ width: scaled + "%" }} />
                    <div className="absolute -top-1 w-[2px] h-4 bg-black right-0" />
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Target: {t.target}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border rounded-xl p-6 text-center">
            <h3 className="font-bold mb-2 flex justify-center gap-2">
              <PieChart size={18}/> Share of EU Contribution
            </h3>

            <div className="relative w-40 h-40 mx-auto">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(#3b82f6 0% ${data.eu.public}%, #f43f5e ${data.eu.public}% 100%)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white w-24 h-24 rounded-full shadow-inner" />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span>Public ({data.eu.public}%)</span>
              <span>Private ({data.eu.private}%)</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Last updated: {data.lastUpdated}
          </span>

          <div className="flex gap-4">
            <a href="https://uif.eu/programmes.html" target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded">
              Explore Projects
            </a>

            <button onClick={() => setIsTableOpen(true)}
              className="border px-4 py-2 rounded">
              View Summary UIF Budget
            </button>
          </div>
        </div>
      </div>

      {/* TABLE MODAL WITH EDIT */}
      {isTableOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setIsTableOpen(false)}>
          <div className="bg-white w-full max-w-7xl p-6 rounded-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">UIF Budget Overview</h2>
              <div className="flex gap-2">
                <button onClick={() => setIsTableEdit(!isTableEdit)}
                  className="border px-3 py-1 flex gap-1">
                  <Edit size={14}/> Edit
                </button>
                <button onClick={() => setIsTableOpen(false)}>✕</button>
              </div>
            </div>

            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">Label</th>
                  <th className="p-2">Guarantees</th>
                  <th className="p-2">Grants</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Multiplier</th>
                  <th className="p-2">Investments</th>
                </tr>
              </thead>

              <tbody>
                {data.table.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border p-2">
                        {isTableEdit ? (
                          <input
                            value={cell}
                            onChange={(e) => {
                              const newTable = [...data.table];
                              newTable[i][j] = e.target.value;
                              setData({ ...data, table: newTable });
                            }}
                            className="w-full border"
                          />
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

      {/* FULL CMS */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-3xl rounded-xl overflow-auto">

            <h2 className="font-bold mb-4">Dashboard CMS</h2>

            <input value={editData.investmentMobilised}
              onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}/>
            <input value={editData.multiplier}
              onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}/>
            <input value={editData.lastUpdated}
              onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}/>

            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={a.label}/>
                <input value={a.value}/>
                <input value={a.percent}/>
              </div>
            ))}

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={()=>setIsCMSOpen(false)}>Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2">
                <Save size={16}/> Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}