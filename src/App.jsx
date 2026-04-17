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

                    {/* FIX */}
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
      // SADECE BU BLOĞU KENDİ APP.JSX'İNDEKİ IMAGE MODAL İLE DEĞİŞTİR

{isImageOpen && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
    onClick={() => setIsImageOpen(false)}
  >
    <div
      className="bg-white w-full max-w-7xl max-h-[90vh] overflow-auto rounded-xl shadow-xl p-6"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-bold uppercase">UIF Budget Overview</h2>
        <button onClick={() => setIsImageOpen(false)}>✕</button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b-2">
              <th className="p-3 text-left">[EUR million]</th>
              <th className="p-3 text-right">Guarantees</th>
              <th className="p-3 text-right">Grants</th>
              <th className="p-3 text-right text-blue-700">GRAND TOTAL</th>
              <th className="p-3 text-right">Multiplier</th>
              <th className="p-3 text-right">Total investments</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            <tr className="bg-slate-100 font-bold">
              <td className="p-3">UIF BUDGET</td>
              <td className="p-3 text-right">7,800.00</td>
              <td className="p-3 text-right">1,741.00</td>
              <td className="p-3 text-right text-blue-700">9,541.00</td>
              <td className="p-3 text-right text-slate-400">—</td>
              <td className="p-3 text-right text-slate-400">—</td>
            </tr>

            <tr>
              <td className="p-3 font-medium">Top-ups</td>
              <td className="p-3 text-right">990.00</td>
              <td className="p-3 text-right">412.38</td>
              <td className="p-3 text-right">1,402.38</td>
              <td className="p-3 text-right text-blue-600">4.54x</td>
              <td className="p-3 text-right font-semibold">6,363.95</td>
            </tr>

            <tr>
              <td className="p-3 pl-8 text-slate-500">↳ Top-ups (contracted)</td>
              <td className="p-3 text-right">990.00</td>
              <td className="p-3 text-right">412.38</td>
              <td className="p-3 text-right">1,402.38</td>
              <td className="p-3 text-right text-blue-600">4.54x</td>
              <td className="p-3 text-right font-semibold">6,363.95</td>
            </tr>

            <tr>
              <td className="p-3 font-medium">EIB exclusive window (assigned)</td>
              <td className="p-3 text-right">2,378.64</td>
              <td className="p-3 text-right">149.75</td>
              <td className="p-3 text-right">2,528.39</td>
              <td className="p-3 text-right text-blue-600">1.22x</td>
              <td className="p-3 text-right font-semibold">3,076.66</td>
            </tr>

            <tr>
              <td className="p-3 font-medium">Open call (allocated)</td>
              <td className="p-3 text-right">2,985.50</td>
              <td className="p-3 text-right">810.49</td>
              <td className="p-3 text-right">3,795.99</td>
              <td className="p-3 text-right text-blue-600">3.14x</td>
              <td className="p-3 text-right font-semibold">11,905.07</td>
            </tr>

            <tr>
              <td className="p-3 pl-8 text-slate-500">↳ Open Call (contracted)</td>
              <td className="p-3 text-right">844.50</td>
              <td className="p-3 text-right">88.04</td>
              <td className="p-3 text-right">932.54</td>
              <td className="p-3 text-right text-blue-600">2.79x</td>
              <td className="p-3 text-right font-semibold">2,599.93</td>
            </tr>

            <tr>
              <td className="p-3 pl-8 text-slate-500">↳ Open Call (approved)</td>
              <td className="p-3 text-right">2,141.00</td>
              <td className="p-3 text-right">722.45</td>
              <td className="p-3 text-right">2,863.45</td>
              <td className="p-3 text-right text-blue-600">3.25x</td>
              <td className="p-3 text-right font-semibold">9,305.14</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-6 text-xs text-slate-400 flex justify-between">
        <span>* Values in EUR million</span>
        <span className="italic">Internal Document</span>
      </div>

    </div>
  </div>
)}

      {/* CMS FULL (RESTORED) */}
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

            <p className="text-xs text-slate-500 mb-2">Funds Overview</p>
            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input className="border p-2 rounded" value={a.label}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].label=e.target.value;
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input className="border p-2 rounded" value={a.value}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].value=e.target.value;
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input className="border p-2 rounded" value={a.percent}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].percent=Number(e.target.value);
                    setEditData({...editData, allocations:arr});
                  }}/>
              </div>
            ))}

            <p className="text-xs text-slate-500 mt-4 mb-2">Targets</p>
            {editData.targets.map((t,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input className="border p-2 rounded" value={t.label}
                  onChange={(e)=>{
                    const arr=[...editData.targets];
                    arr[i].label=e.target.value;
                    setEditData({...editData, targets:arr});
                  }}/>
                <input className="border p-2 rounded" value={t.actual}
                  onChange={(e)=>{
                    const arr=[...editData.targets];
                    arr[i].actual=Number(e.target.value);
                    setEditData({...editData, targets:arr});
                  }}/>
                <input className="border p-2 rounded" value={t.target}
                  onChange={(e)=>{
                    const arr=[...editData.targets];
                    arr[i].target=Number(e.target.value);
                    setEditData({...editData, targets:arr});
                  }}/>
              </div>
            ))}

            <p className="text-xs text-slate-500 mt-4 mb-2">EU Contribution</p>
            <div className="grid grid-cols-2 gap-2">
              <input className="border p-2 rounded"
                value={editData.eu.public}
                onChange={(e)=>{
                  const val = Number(e.target.value);
                  setEditData({...editData, eu:{public:val, private:100-val}});
                }}/>
              <input className="border p-2 rounded"
                value={editData.eu.private}
                onChange={(e)=>{
                  const val = Number(e.target.value);
                  setEditData({...editData, eu:{private:val, public:100-val}});
                }}/>
            </div>

            <p className="text-xs text-slate-500 mt-4 mb-2">Last Updated</p>
            <input className="border p-2 w-full rounded"
              value={editData.lastUpdated}
              onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}/>

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={()=>setIsCMSOpen(false)}>Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 flex gap-2">
                <Save size={16}/> Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}