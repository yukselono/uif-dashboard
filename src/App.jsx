import React, { useState } from "react";
import { Settings, Save } from "lucide-react";

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

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">UIF Data Dashboard</h1>
            <p className="text-slate-500 text-sm">
              Tracking deployment progress of UIF
            </p>
          </div>

          <button onClick={() => setIsCMSOpen(true)} className="border px-3 py-2 flex gap-2">
            <Settings size={16}/> CMS
          </button>
        </div>

        {/* FUNDS */}
        {data.allocations.map((a, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between text-sm">
              <span>{a.label}</span>
              <span>{a.value} ({a.percent}%)</span>
            </div>
            <div className="bg-slate-200 h-3 rounded">
              <div className={`${a.color} h-3 rounded`} style={{ width: a.percent + "%" }} />
            </div>
          </div>
        ))}

        {/* TARGETS */}
        <div className="mt-8">
          <h3 className="font-bold mb-4">Progress towards targets</h3>

          {data.targets.map((t, i) => (
            <div key={i} className="mb-8">

              <div className="text-sm mb-1">{t.label}</div>

              <div className="relative h-3 bg-slate-200 rounded">

                {/* actual */}
                <div
                  className={`${t.color} h-3 rounded`}
                  style={{ width: t.actual + "%" }}
                />

                {/* actual label */}
                <div
                  className="absolute -top-6 text-xs"
                  style={{ left: `calc(${t.actual}% - 10px)` }}
                >
                  {t.actual}%
                </div>

                {/* target line */}
                <div
                  className="absolute top-[-4px] w-[2px] h-5 bg-black"
                  style={{ left: t.target + "%" }}
                />

                {/* target label */}
                <div
                  className="absolute text-xs text-slate-500"
                  style={{ left: `calc(${t.target}% + 4px)`, top: "14px" }}
                >
                  {t.target}%
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-xs text-slate-400">
          Last updated: {data.lastUpdated}
        </div>

      </div>

      {/* CMS FULL */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-4xl rounded-xl overflow-auto">

            <h2 className="font-bold mb-4">Dashboard CMS</h2>

            {/* TOP */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input value={editData.investmentMobilised}
                onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}/>
              <input value={editData.multiplier}
                onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}/>
              <input value={editData.lastUpdated}
                onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}/>
            </div>

            {/* FUNDS */}
            <h4 className="text-sm font-semibold mb-2">Funds</h4>
            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input value={a.label} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i].label=e.target.value;
                  setEditData({...editData, allocations:arr});
                }}/>
                <input value={a.value} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i].value=e.target.value;
                  setEditData({...editData, allocations:arr});
                }}/>
                <input value={a.percent} onChange={(e)=>{
                  const arr=[...editData.allocations];
                  arr[i].percent=Number(e.target.value);
                  setEditData({...editData, allocations:arr});
                }}/>
              </div>
            ))}

            {/* TARGETS */}
            <h4 className="text-sm font-semibold mt-4 mb-2">Targets</h4>
            {editData.targets.map((t,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input value={t.label} onChange={(e)=>{
                  const arr=[...editData.targets];
                  arr[i].label=e.target.value;
                  setEditData({...editData, targets:arr});
                }}/>
                <input value={t.actual} onChange={(e)=>{
                  const arr=[...editData.targets];
                  arr[i].actual=Number(e.target.value);
                  setEditData({...editData, targets:arr});
                }}/>
                <input value={t.target} onChange={(e)=>{
                  const arr=[...editData.targets];
                  arr[i].target=Number(e.target.value);
                  setEditData({...editData, targets:arr});
                }}/>
              </div>
            ))}

            {/* EU */}
            <h4 className="text-sm font-semibold mt-4 mb-2">EU Split</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input value={editData.eu.public}
                onChange={(e)=>setEditData({...editData, eu:{public:Number(e.target.value), private:100-Number(e.target.value)}})}/>
              <input value={editData.eu.private}
                onChange={(e)=>setEditData({...editData, eu:{private:Number(e.target.value), public:100-Number(e.target.value)}})}/>
            </div>

            <div className="flex justify-end gap-2">
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