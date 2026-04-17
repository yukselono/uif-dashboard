import React, { useState } from "react";
import { Settings, Save } from "lucide-react";

const defaultData = {
  investmentMobilised: "€25.2 bn",
  multiplier: "x3.0",
  allocations: [
    { label: "Funds Allocated", percent: 88.3, value: "€8.4 bn", color: "#4f46e5" },
    { label: "Programmes signed", percent: 44.2, value: "€4.2 bn", color: "#3b82f6" },
    { label: "Guarantees deployed", percent: 39.4, value: "€2.7 bn", color: "#10b981" },
    { label: "Remaining funds", percent: 11.7, value: "€1.1 bn", color: "#f59e0b" },
  ],
  targets: [
    { label: "Green Target", actual: 32.7, target: 20, color: "#10b981" },
    { label: "SME Target", actual: 9.3, target: 15, color: "#f59e0b" },
  ],
  lastUpdated: "16 April 2026"
};

export default function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("uif-data");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [editData, setEditData] = useState(data);
  const [isCMSOpen, setIsCMSOpen] = useState(false);

  const handleSave = () => {
    setData(editData);
    localStorage.setItem("uif-data", JSON.stringify(editData));
    setIsCMSOpen(false);
  };

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow border">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b">
          <div>
            <h1 className="text-2xl font-bold">UIF Data Dashboard</h1>
            <p className="text-slate-500 text-sm">
              Tracking deployment progress of UIF
            </p>
          </div>

          <button
            onClick={() => {
              setEditData(data);
              setIsCMSOpen(true);
            }}
            className="px-4 py-2 border rounded flex items-center gap-2"
          >
            <Settings size={16}/> CMS
          </button>
        </div>

        {/* FUNDS */}
        <div className="p-6">
          {data.allocations.map((a, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span>{a.label}</span>
                <span>{a.value} ({a.percent}%)</span>
              </div>

              <div className="bg-slate-200 h-3 rounded">
                <div
                  style={{ width: a.percent + "%", background: a.color }}
                  className="h-3 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* TARGETS */}
        <div className="px-6 pb-6">
          <h3 className="font-bold mb-4">Progress towards targets</h3>

          {data.targets.map((t, i) => {
            const progress = Math.min((t.actual / t.target) * 100, 100);

            return (
              <div key={i} className="mb-6">
                {/* label */}
                <div className="flex justify-between text-sm mb-1">
                  <span>{t.label}</span>
                  <span>{t.actual}%</span>
                </div>

                {/* bar */}
                <div className="relative bg-slate-200 h-2 rounded">
                  <div
                    style={{ width: progress + "%", background: t.color }}
                    className="h-2 rounded"
                  />

                  {/* target line */}
                  <div
                    className="absolute top-[-4px] w-[2px] h-4 bg-black"
                    style={{ left: "100%" }}
                  />
                </div>

                {/* labels */}
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span></span>
                  <span>Target {t.target}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t text-xs text-slate-400">
          Last updated: {data.lastUpdated}
        </div>
      </div>

      {/* CMS */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl">

            <h2 className="font-bold mb-4">Dashboard CMS</h2>

            {/* TOP */}
            <input
              className="border p-2 w-full mb-2"
              value={editData.investmentMobilised}
              onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}
            />

            <input
              className="border p-2 w-full mb-4"
              value={editData.multiplier}
              onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}
            />

            {/* FUNDS */}
            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input value={a.label}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].label=e.target.value;
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input value={a.value}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].value=e.target.value;
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input value={a.percent}
                  onChange={(e)=>{
                    const arr=[...editData.allocations];
                    arr[i].percent=Number(e.target.value);
                    setEditData({...editData, allocations:arr});
                  }}/>
              </div>
            ))}

            {/* TARGETS */}
            {editData.targets.map((t,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input value={t.label}/>
                <input value={t.actual}/>
                <input value={t.target}/>
              </div>
            ))}

            {/* DATE */}
            <input
              className="border p-2 w-full mt-4"
              value={editData.lastUpdated}
              onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}
            />

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