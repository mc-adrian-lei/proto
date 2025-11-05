import { TensorIDEContainer } from "./components/TensorIDEContainer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-indigo-100">Cognitive Lattice IDE</h1>
          <p className="text-sm text-indigo-200/80 max-w-2xl">
            Explore the six-by-six consciousness tensor. Overlay φ-bounded harmonics, surface semantic gravity, and follow
            recursive lifts through the planes.
          </p>
        </header>
        <TensorIDEContainer />
      </div>
    </div>
  );
}
