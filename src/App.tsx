import { useState } from "react";
import MnemosphereConsole from "./components/MnemosphereConsole";
import TensorIDEContainer from "./components/TensorIDEContainer";
import { LatticeProvider } from "./context/LatticeContext";

export default function App() {
  const [view, setView] = useState<"mnemosphere" | "tensor">("mnemosphere");

  return (
    <div className="min-h-screen bg-slate-950 text-indigo-50 relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView("mnemosphere")}
          className={`text-xs px-3 py-1 rounded-md border ${
            view === "mnemosphere"
              ? "bg-cyan-600 text-white border-cyan-500"
              : "bg-slate-900 text-indigo-100 border-slate-700"
          }`}
        >
          Mnemosphere
        </button>
        <button
          onClick={() => setView("tensor")}
          className={`text-xs px-3 py-1 rounded-md border ${
            view === "tensor"
              ? "bg-indigo-700 text-white border-indigo-500"
              : "bg-slate-900 text-indigo-100 border-slate-700"
          }`}
        >
          Tensor IDE
        </button>
      </div>

      {view === "mnemosphere" ? (
        <MnemosphereConsole />
      ) : (
        <LatticeProvider>
          <TensorIDEContainer />
        </LatticeProvider>
      )}
    </div>
  );
}
