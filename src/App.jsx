import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Euro,
  TrendingUp,
  Wallet,
  Target,
  PieChart,
  Settings,
  Save,
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
  lastUpdated: new Date().toISOString()
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("uif-data");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [editData, setEditData] = useState(data);

  useEffect(() => setLoaded(true), []);

  const openCMS = () => {
    setEditData(data);
    setIsCMSOpen(true);
  };

  const handleSave = () => {
    setData(editData);
    localStorage.setItem("uif-data", JSON.stringify(editData));
    setIsCMSOpen(false);
    setTimeout(() => window.location.reload(), 200);
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
                  <div
                    className={`${item.color} h-3 rounded`}
                    style={{ width: item.percent + "%" }}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowMore(!showMore)}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              {showMore ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              {showMore ? "Show less" : "Show more"}
            </button>
          </div>
        </div>

        {/* TARGET + PIE */}
        <div className="grid grid-cols-2 gap-6 px-6 pb-6">

          {/* TARGETS */}
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
                    <div
                      className={`${t.color} h-2 rounded`}
                      style={{ width: scaled + "%" }}
                    />
                    <div className="absolute -top-1 w-[2px] h-4 bg-black right-0" />
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    Target: {t.target}%
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
            Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
          </span>

          <div className="flex gap-4">
            <a href="https://uif.eu/programmes.html" target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded">
              Explore Projects
            </a>

            <button onClick={() => setIsImageOpen(true)} className="border px-4 py-2 rounded">
              View Investment Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-4">
            <img src={`${import.meta.env.BASE_URL}excel.png`} />
          </div>
        </div>
      )}

      {/* CMS */}
      {isCMSOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-3xl overflow-auto">

            <h2 className="font-bold mb-4">CMS</h2>

            {/* TOP */}
            <input value={editData.investmentMobilised}
              onChange={(e)=>setEditData({...editData, investmentMobilised:e.target.value})}/>
            <input value={editData.multiplier}
              onChange={(e)=>setEditData({...editData, multiplier:e.target.value})}/>

            {/* ALLOCATIONS */}
            {editData.allocations.map((a,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={a.label}
                  onChange={(e)=>{
                    const arr = editData.allocations.map((it,idx)=>idx===i?{...it,label:e.target.value}:it);
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input value={a.value}
                  onChange={(e)=>{
                    const arr = editData.allocations.map((it,idx)=>idx===i?{...it,value:e.target.value}:it);
                    setEditData({...editData, allocations:arr});
                  }}/>
                <input value={a.percent}
                  onChange={(e)=>{
                    const arr = editData.allocations.map((it,idx)=>idx===i?{...it,percent:Number(e.target.value)}:it);
                    setEditData({...editData, allocations:arr});
                  }}/>
              </div>
            ))}

            {/* TARGETS */}
            {editData.targets.map((t,i)=>(
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={t.label}
                  onChange={(e)=>{
                    const arr = editData.targets.map((it,idx)=>idx===i?{...it,label:e.target.value}:it);
                    setEditData({...editData, targets:arr});
                  }}/>
                <input value={t.actual}
                  onChange={(e)=>{
                    const arr = editData.targets.map((it,idx)=>idx===i?{...it,actual:Number(e.target.value)}:it);
                    setEditData({...editData, targets:arr});
                  }}/>
                <input value={t.target}
                  onChange={(e)=>{
                    const arr = editData.targets.map((it,idx)=>idx===i?{...it,target:Number(e.target.value)}:it);
                    setEditData({...editData, targets:arr});
                  }}/>
              </div>
            ))}

            {/* EU */}
            <input value={editData.eu.public}
              onChange={(e)=>setEditData({...editData, eu:{public:Number(e.target.value), private:100-Number(e.target.value)}})}/>
            <input value={editData.eu.private}
              onChange={(e)=>setEditData({...editData, eu:{private:Number(e.target.value), public:100-Number(e.target.value)}})}/>

            {/* LAST UPDATED */}
            <input value={editData.lastUpdated}
              onChange={(e)=>setEditData({...editData, lastUpdated:e.target.value})}/>

            <div className="flex justify-end gap-2 mt-4">
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