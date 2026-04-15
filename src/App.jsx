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
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

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
  };

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow border">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center border-b">
          <div>
            <h1 className="text-3xl font-bold">Current State of Play</h1>
            <p className="text-slate-500">
              Tracking the progress and impact of the Ukraine Investment Framework.
            </p>
          </div>

          <button onClick={openCMS} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border">
            <Settings size={16}/> Manage Data (CMS)
          </button>
        </div>

        {/* TOP CARDS */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl relative">
            <Euro className="absolute right-4 top-4 opacity-10" size={80}/>
            <p className="text-xs uppercase text-blue-200">Investment Mobilised</p>
            <h2 className="text-3xl font-bold">{data.investmentMobilised}</h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-xl relative">
            <TrendingUp className="absolute right-4 top-4 opacity-10" size={80}/>
            <p className="text-xs uppercase text-emerald-200">Multiplier Effect</p>
            <h2 className="text-3xl font-bold">{data.multiplier}</h2>
          </div>
        </div>

        {/* FUNDS */}
        <div className="px-6 pb-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-2 flex gap-2">
              <Wallet size={18}/> UIF Funds Overview
            </h3>

            {data.allocations.map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value} ({item.percent}%)</span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded">
                  <div
                    className={`${item.color} h-3 rounded transition-all duration-1000`}
                    style={{ width: loaded ? item.percent + "%" : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 COL */}
        <div className="grid grid-cols-2 gap-6 px-6 pb-6">

          {/* TARGETS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex gap-2">
              <Target size={18}/> Progress towards targets
            </h3>

            {data.targets.map((t, i) => (
              <div key={i} className="mb-6">
                <div className="text-sm font-medium text-slate-700 mb-1">
                  {t.label}
                </div>

               <div className="relative mt-2 bg-slate-200 h-2 rounded">

  {/* ACTUAL BAR */}
  <div
    className={`${t.color} h-2 rounded`}
    style={{ width: t.actual + "%" }}
  />

  {/* ACTUAL VALUE */}
  <div
    className="absolute -top-7 text-xs font-semibold text-slate-700"
    style={{ left: t.actual + "%", transform: "translateX(-50%)" }}
  >
    {t.actual}%
  </div>

  {/* TARGET LINE */}
  <div
    className="absolute -top-1 w-[2px] h-4 bg-black"
    style={{ left: t.target + "%" }}
  />

  {/* TARGET LABEL */}
  <div
    className="absolute top-5 text-[10px] text-slate-500"
    style={{ left: t.target + "%", transform: "translateX(-50%)" }}
  >
    {t.target}%
  </div>

</div>
              </div>
            ))}
          </div>

          {/* PIE */}
          <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
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

              {/* CLEAN CENTER */}
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

        {/* CTA */}
        <div className="p-6 border-t flex justify-center gap-4">
          <a
            href="https://uif.eu/programmes.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <span>Explore Projects</span>
            <ArrowRight size={18}/>
          </a>

          <button
            onClick={() => setIsImageOpen(true)}
            className="border px-6 py-3 rounded-xl"
          >
            View Investment Dashboard
          </button>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {isImageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-semibold">UIF Budget Overview</h3>
              <button onClick={() => setIsImageOpen(false)}>✕</button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-100">
              <img
                src={`${import.meta.env.BASE_URL}excel.png`}
                className="mx-auto max-w-full rounded shadow"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}