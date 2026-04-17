import React, { useState } from "react";
import {
  ArrowRight,
  Settings,
  Save,
  Wallet,
  Target,
  PieChart,
  ChevronDown,
  ChevronUp
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
  lastUpdated: "16 April 2026"
};

export default function App() {
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
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

      {/* FULL TABLE MODAL */}
      {isTableOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
             onClick={() => setIsTableOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto p-6"
               onClick={(e) => e.stopPropagation()}>

            <h2 className="font-bold mb-4">UIF Budget Overview</h2>

            <table className="w-full text-sm border">
              <thead className="bg-orange-200">
                <tr>
                  <th className="border p-2">UIF Budget (EUR million)</th>
                  <th className="border p-2">Guarantees</th>
                  <th className="border p-2">Grants</th>
                  <th className="border p-2">Grand Total</th>
                  <th className="border p-2">Multiplier</th>
                  <th className="border p-2">Total Investments</th>
                </tr>
              </thead>

              <tbody>
                <tr className="bg-blue-100 font-semibold">
                  <td className="border p-2">UIF Budget</td>
                  <td className="border p-2">7,800.0</td>
                  <td className="border p-2">1,741.0</td>
                  <td className="border p-2">9,541.0</td>
                  <td></td><td></td>
                </tr>

                <tr>
                  <td className="border p-2">Top-ups</td>
                  <td className="border p-2">990.0</td>
                  <td className="border p-2">412.4</td>
                  <td className="border p-2">1,402.4</td>
                  <td className="border p-2">4.5</td>
                  <td className="border p-2">6,364.0</td>
                </tr>

                <tr>
                  <td className="border p-2">Top-ups (contracted)</td>
                  <td className="border p-2">990.0</td>
                  <td className="border p-2">412.4</td>
                  <td className="border p-2">1,402.4</td>
                  <td className="border p-2">4.5</td>
                  <td className="border p-2">6,364.0</td>
                </tr>

                <tr>
                  <td className="border p-2">EIB exclusive window</td>
                  <td className="border p-2">2,378.6</td>
                  <td className="border p-2">149.8</td>
                  <td className="border p-2">2,528.4</td>
                  <td className="border p-2">1.2</td>
                  <td className="border p-2">3,076.7</td>
                </tr>

                <tr className="bg-red-200 font-semibold">
                  <td className="border p-2">Total allocated</td>
                  <td className="border p-2">6,879.1</td>
                  <td className="border p-2">1,542.8</td>
                  <td className="border p-2">8,421.9</td>
                  <td className="border p-2">3.0</td>
                  <td className="border p-2">25,271.6</td>
                </tr>

                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total unallocated</td>
                  <td className="border p-2">920.9</td>
                  <td className="border p-2">198.2</td>
                  <td className="border p-2">1,119.1</td>
                  <td></td><td></td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      )}

      {/* CMS FULL WORKING */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-3xl rounded-xl">

            <h2 className="font-bold mb-4">Dashboard CMS</h2>

            <input value={editData.investmentMobilised}
              onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}/>
            <input value={editData.multiplier}
              onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}/>

            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={a.label} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i]={...arr[i],label:e.target.value};
                  setEditData({...editData, allocations:arr});
                }}/>
                <input value={a.value} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i]={...arr[i],value:e.target.value};
                  setEditData({...editData, allocations:arr});
                }}/>
                <input value={a.percent} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i]={...arr[i],percent:Number(e.target.value)};
                  setEditData({...editData, allocations:arr});
                }}/>
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