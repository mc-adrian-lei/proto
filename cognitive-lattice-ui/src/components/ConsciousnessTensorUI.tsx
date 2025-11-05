import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import latticeData from "../data/cognitiveLattice.json";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { fields, planes, tensorEngine, phi } from "../lib/tensorEngine";
import { cn } from "../lib/utils";

type Archetype = (typeof latticeData.archetypes)[keyof typeof latticeData.archetypes];

type TensorPoint = {
  fieldIndex: number;
  planeIndex: number;
};

const projectionRadius = 120;

function polarProject({ fieldIndex, planeIndex }: TensorPoint, bias: number) {
  const angle = (fieldIndex / fields.length) * Math.PI * 2 + bias;
  const radius = projectionRadius * (0.6 + planeIndex / planes.length);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function ArchetypeBadge({ name, archetype }: { name: string; archetype: Archetype }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-sm"
      style={{ boxShadow: `0 0 25px ${archetype.color}33` }}
    >
      <span className="text-lg" aria-hidden>
        {archetype.icon}
      </span>
      <div>
        <p className="font-semibold tracking-wide text-white">{name}</p>
        <p className="text-xs text-white/70">{archetype.desc}</p>
      </div>
    </div>
  );
}

export default function ConsciousnessTensorUI() {
  const [fieldIndex, setFieldIndex] = useState(0);
  const [planeIndex, setPlaneIndex] = useState(0);
  const [phaseShift, setPhaseShift] = useState(35);

  const aspect = tensorEngine.getAspect(fieldIndex, planeIndex);

  const tensorPoints = useMemo(() => {
    return fields.flatMap((_, fIndex) =>
      planes.map((_, pIndex) => ({ fieldIndex: fIndex, planeIndex: pIndex }))
    );
  }, []);

  const projected = polarProject(
    { fieldIndex, planeIndex },
    (phaseShift / 360) * Math.PI * 2
  );

  return (
    <div className="flex min-h-screen flex-col gap-8 px-6 py-10 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consciousness Tensor Navigator</CardTitle>
            <p className="text-sm text-white/80">
              Traverse the lattice by selecting a cognition field and a reflective plane.
              Motion is modulated by the φ resonance slider.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <section className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/60">Fields</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {fields.map((field, index) => (
                  <Button
                    key={field}
                    variant={index === fieldIndex ? "primary" : "ghost"}
                    className={cn(
                      "text-left",
                      index === fieldIndex && "ring-2 ring-indigo-200/70"
                    )}
                    onClick={() => setFieldIndex(index)}
                  >
                    <span className="text-sm font-semibold">{field}</span>
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/60">Planes</h2>
              <div className="flex flex-wrap gap-3">
                {planes.map((plane, index) => (
                  <Button
                    key={plane}
                    variant={index === planeIndex ? "primary" : "ghost"}
                    className={cn(
                      "text-left",
                      index === planeIndex && "ring-2 ring-indigo-200/70"
                    )}
                    onClick={() => setPlaneIndex(index)}
                  >
                    <span className="text-sm font-semibold">{plane}</span>
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>φ phase offset</span>
                <span>{phaseShift.toFixed(0)}°</span>
              </div>
              <Slider
                min={0}
                max={180}
                step={1}
                value={[phaseShift]}
                onValueChange={([value]) => setPhaseShift(value)}
                aria-label="Phase offset"
              />
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cognitive Archetype Overlay</CardTitle>
            <p className="text-sm text-white/80">
              Resonant patterns align each selection with archetypal signatures from the lattice archive.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {Object.entries(latticeData.archetypes).map(([name, archetype]) => (
              <div key={name} className="contents">
                <ArchetypeBadge name={name} archetype={archetype} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>Tensor Projection</CardTitle>
          <p className="text-sm text-white/80">
            Current focus: <span className="font-semibold text-white">{aspect.field}</span> in
            the <span className="font-semibold text-white">{aspect.plane}</span> plane.
          </p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-8">
          <div className="relative flex flex-1 items-center justify-center">
            <motion.div
              className="relative h-[320px] w-[320px] overflow-visible"
              style={{ perspective: 800 }}
            >
              <div className="absolute inset-0 rounded-full border border-white/10" />
              {tensorPoints.map((point) => {
                const coords = polarProject(
                  point,
                  (phaseShift / 360) * Math.PI * 2
                );
                const isActive =
                  point.fieldIndex === fieldIndex && point.planeIndex === planeIndex;
                return (
                  <motion.div
                    key={`${point.fieldIndex}-${point.planeIndex}`}
                    className={cn(
                      "absolute flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[10px] uppercase tracking-wider text-white/80",
                      isActive && "border-indigo-300/80 bg-indigo-500/60 text-white shadow-lg"
                    )}
                    style={{
                      left: `calc(50% + ${coords.x}px - 1rem)`,
                      top: `calc(50% + ${coords.y}px - 1rem)`,
                    }}
                    initial={{ scale: isActive ? 1.1 : 0.85 }}
                    animate={{ scale: isActive ? 1.15 : 0.9, opacity: isActive ? 1 : 0.75 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {planes[point.planeIndex][0]}
                  </motion.div>
                );
              })}
              <motion.div
                className="absolute inset-20 rounded-full border-2 border-dashed border-indigo-300/60"
                animate={{ rotate: phaseShift / 2 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Golden Ratio</p>
              <p className="mt-2 text-3xl font-semibold text-white">{phi.toFixed(6)}</p>
              <p className="mt-1 text-xs text-white/70">
                φ grounds oscillatory resonance for recursive synthesis patterns.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Tensor Properties</p>
              <ul className="mt-2 space-y-2 text-sm text-white/80">
                {latticeData.tensorProperties.map((property) => (
                  <li key={property} className="flex items-center justify-between">
                    <span>{property}</span>
                    <span className="text-xs text-white/50">{(phaseShift / 180).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Projection Vector</p>
              <p className="mt-2 text-sm text-white">
                x: {projected.x.toFixed(1)} · y: {projected.y.toFixed(1)}
              </p>
              <p className="mt-1 text-xs text-white/70">
                Coordinates emerge from polar projection under the current φ phase offset.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Lattice Fields</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-white/60">
              {latticeData.fields.map((field) => (
                <span
                  key={field}
                  className={cn(
                    "rounded-full border border-white/10 px-3 py-1",
                    field === aspect.field && "border-indigo-300/60 text-white"
                  )}
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
