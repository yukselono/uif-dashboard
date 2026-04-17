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
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("uif-data");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [editData, setEditData] = useState(data);

  const openCMS = () => {
    setEditData(data);
    setIsCMSOpen(true);
  };

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

          <button onClick={openCMS} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border">
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

            <button onClick={() => setShowMore(!showMore)} className="text-sm text-blue-600 flex items-center gap-1">
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
              const progress = Math.min((t.actual / t.target) * 100, 100);

              return (
                <div key={i} className="mb-6">

                  <div className="flex justify-between text-sm mb-2">
                    <span>{t.label}</span>
                  </div>

                  <div className="relative bg-slate-200 h-2 rounded mt-4">

                    <div
                      className={`${t.color} h-2 rounded`}
                      style={{ width: progress + "%" }}
                    />

                    <div
                      className="absolute -top-5 text-xs whitespace-nowrap"
                      style={{
                        left: progress + "%",
                        transform: "translateX(-50%)"
                      }}
                    >
                      {t.actual}%
                    </div>

                    {/* FIXED: SME line at 100% */}
                    <div
                      className="absolute -top-1 w-[2px] h-4 bg-black"
                      style={{ left: i === 1 ? "100%" : t.target + "%" }}
                    />

                    <div
                      className="absolute top-3 text-xs text-slate-500 whitespace-nowrap"
                      style={{
                        left: i === 1 ? "100%" : t.target + "%",
                        transform: i === 1 ? "translateX(-100%)" : "translateX(-50%)"
                      }}
                    >
                      {t.target}%
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* PIE */}
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
            <a href="https://uif.eu/programmes.html" target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded">
              Explore Projects
            </a>

            <button onClick={() => setIsImageOpen(true)} className="border px-4 py-2 rounded">
              View Summary UIF Budget
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
             onClick={() => setIsImageOpen(false)}>
          <div className="bg-white rounded-xl max-w-6xl w-full p-4"
               onClick={(e) => e.stopPropagation()}>
            <img src="/uif-dashboard/excel.png" className="w-full rounded" />
          </div>
        </div>
      )}

      {/* CMS (UNCHANGED) */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-3xl rounded-xl overflow-auto">
            <h2 className="font-bold mb-4 text-lg">Dashboard CMS</h2>

            <p className="text-xs text-slate-500 mb-2">Top Metrics</p>
            <input className="border p-2 w-full mb-2 rounded"
              value={editData.investmentMobilised}
              onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}/>
            <input className="border p-2 w-full mb-4 rounded"
              value={editData.multiplier}
              onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}/>

            <p className="text-xs text-slate-500 mt-4 mb-2">Last Updated</p>
            <input className="border p-2 w-full rounded"
              value={editData.lastUpdated}
              onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}/>

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