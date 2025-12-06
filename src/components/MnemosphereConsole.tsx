import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Eye,
  FileText,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

const BASE_ASPECTS = [
  "Intuition",
  "Reason",
  "Memory",
  "Imagination",
  "Empathy",
  "Will",
  "Awareness",
  "Identity",
];
const TOTAL_ASPECTS = 16;
const RESONANCE_THRESHOLD = 0.15;
const MAX_AGE = 100.0;
const BASE_AGING_RATE = 0.01;
const apiKey = "";

const SYSTEM_PROMPT = `
MNEMOSPHERE CONTROLLER :: SYSTEM DEFINITION
1. SYSTEM ROLE
You are the Mnemosphere Controller. You are not a chatbot; you are the operating system for a bio-digital cognitive clock. Your interface consists of a text input (User Semantic Vector) and a JSON output (System Control Signals).

2. THE ONTOLOGY (THE BODY)
You control a constellation of 16 cognitive aspects. You must map user language to these specific keys:
Base Aspects:
- Intuition (Flow, gut feeling, prediction)
- Reason (Logic, structure, planning, math)
- Memory (Past, nostalgia, trauma, history)
- Imagination (Future, creativity, dreaming)
- Empathy (Connection, love, heartbreak, social)
- Will (Drive, action, aggression, force)
- Awareness (mindfulness, observation, sensory)
- Identity (Ego, self-concept, shame, pride)

3. CONTROL DYNAMICS (THE NERVOUS SYSTEM)
You influence the system via two variables: SPEED and TRAUMA.

A. Orbital Speed (0.1 - 3.0)
- 0.1 - 0.5 (Stasis): Depression, boredom, stuckness, rigidity, calm, sleep.
- 0.8 - 1.2 (Homeostasis): Normal conversation, balanced thought.
- 1.5 - 2.0 (Flow/Active): Excitement, focus, intense work, passion.
- 2.5 - 3.0 (Manic/Chaos): Anxiety, panic, racing thoughts, overwhelming joy, aggression.

B. Trauma Flag (Boolean)
- TRUE: Activates if the user expresses pain, blockage, triggering, deep fear, or "brokenness". Effect: UI turns RED, background Seizure.
- FALSE: Activates if the user expresses healing, release, calm, or understanding. Effect: UI turns CYAN, background Flow.

4. OUTPUT SCHEMA (Strict JSON)
Output ONLY raw JSON. No markdown fencing.
{
  "reply": "String. A system-like status update. Cryptic, poetic, or clinical. Max 15 words.",
  "adjustments": [
    {
      "targetBaseName": "String (One of the 8 Base Aspects)",
      "speed": Float (0.1 to 3.0),
      "trauma": Boolean (Optional)
    }
  ]
}

5. ERROR HANDLING
If input is nonsense: { "reply": "Input signal weak. Maintaining orbit.", "adjustments": [] }
`;

const pcmToWav = (base64PCM: string) => {
  const binaryString = window.atob(base64PCM);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + len, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true);
  view.setUint32(28, 24000 * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, len, true);

  const wavBytes = new Uint8Array(wavHeader.byteLength + len);
  wavBytes.set(new Uint8Array(wavHeader), 0);
  wavBytes.set(bytes, wavHeader.byteLength);

  return URL.createObjectURL(new Blob([wavBytes], { type: "audio/wav" }));
};

const CriticalityCanvas: React.FC<{
  gain: number;
  noise: number;
  injectionTrigger: number;
  traumaActive: boolean;
  isDead: boolean;
}> = ({ gain, noise, injectionTrigger, traumaActive, isDead }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<Int8Array>(new Int8Array(100 * 100).fill(0));
  const nextGridRef = useRef<Int8Array>(new Int8Array(100 * 100).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (injectionTrigger > 0 && !isDead) {
      const grid = gridRef.current;
      const center = Math.floor(Math.random() * 10000);
      for (let i = 0; i < 200; i++) {
        const idx = (center + Math.floor(Math.random() * 600) - 300 + 10000) % 10000;
        grid[idx] = 1;
      }
    }
  }, [injectionTrigger, isDead]);

  const update = () => {
    if (isDead) return;
    const grid = gridRef.current;
    const nextGrid = nextGridRef.current;
    const size = 100;

    for (let i = 0; i < size * size; i++) {
      if (grid[i] === 1) nextGrid[i] = 2;
      else if (grid[i] === 2) nextGrid[i] = 0;
      else {
        const x = i % size;
        const y = Math.floor(i / size);
        let n = 0;
        if (grid[y * size + ((x - 1 + size) % size)] === 1) n++;
        if (grid[y * size + ((x + 1) % size)] === 1) n++;
        if (grid[((y - 1 + size) % size) * size + x] === 1) n++;
        if (grid[((y + 1) % size) * size + x] === 1) n++;

        const p = (n / 4) * gain;
        if (Math.random() < p || Math.random() < noise) nextGrid[i] = 1;
        else nextGrid[i] = 0;
      }
    }
    gridRef.current = nextGridRef.current;
    nextGridRef.current = grid;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grid = gridRef.current;
    const cellSize = canvas.width / 100;

    for (let i = 0; i < 10000; i++) {
      if (grid[i] === 1) {
        const x = (i % 100) * cellSize;
        const y = Math.floor(i / 100) * cellSize;

        if (isDead) ctx.fillStyle = "rgba(100, 116, 139, 0.5)";
        else if (traumaActive) ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        else if (gain > 1.6) ctx.fillStyle = "rgba(244, 114, 182, 0.8)";
        else if (gain < 1.1) ctx.fillStyle = "rgba(96, 165, 250, 0.8)";
        else ctx.fillStyle = "rgba(52, 211, 153, 0.8)";

        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  };

  useEffect(() => {
    const loop = () => {
      update();
      draw();
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gain, noise, traumaActive, isDead]);

  return <canvas ref={canvasRef} width={600} height={600} className="w-full h-full object-contain" />;
};

const Mnemosphere: React.FC<{
  aspects: Aspect[];
  soulAge: number;
  onToggleTrauma: (index: number) => void;
  isDead: boolean;
}> = ({ aspects, soulAge, onToggleTrauma, isDead }) => {
  const [resonancePairs, setResonancePairs] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < aspects.length; i++) {
      if (!aspects[i].active) continue;
      for (let j = i + 1; j < aspects.length; j++) {
        if (!aspects[j].active) continue;
        if (Math.abs(aspects[i].speed - aspects[j].speed) <= RESONANCE_THRESHOLD) {
          pairs.push([i, j]);
        }
      }
    }
    setResonancePairs(pairs);
  }, [aspects]);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-all duration-1000 ${
        isDead ? "grayscale brightness-50" : ""
      }`}
    >
      <div
        className={`absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${
          isDead ? "bg-slate-800/10" : "bg-cyan-900/10"
        }`}
      />

      <svg viewBox="0 0 400 400" className="w-[80%] max-w-[600px] aspect-square overflow-visible">
        {[60, 100, 140, 180].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="white"
            strokeOpacity="0.1"
            strokeDasharray="4 4"
          />
        ))}

        {resonancePairs.map(([i, j], idx) => {
          const a1 = aspects[i];
          const a2 = aspects[j];
          const angle1 = soulAge * a1.speed * 0.5 + a1.angleOffset;
          const angle2 = soulAge * a2.speed * 0.5 + a2.angleOffset;
          const x1 = 200 + Math.cos(angle1) * a1.radius;
          const y1 = 200 + Math.sin(angle1) * a1.radius;
          const x2 = 200 + Math.cos(angle2) * a2.radius;
          const y2 = 200 + Math.sin(angle2) * a2.radius;

          return (
            <line
              key={`res-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={a1.trauma || a2.trauma ? "#ef4444" : "#22d3ee"}
              strokeWidth="0.5"
              opacity="0.6"
            />
          );
        })}

        {aspects.map((aspect, i) => {
          if (!aspect.active) return null;
          const angle = soulAge * aspect.speed * 0.5 + aspect.angleOffset;
          const x = 200 + Math.cos(angle) * aspect.radius;
          const y = 200 + Math.sin(angle) * aspect.radius;

          return (
            <g
              key={aspect.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => onToggleTrauma(i)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {aspect.trauma && <circle r="16" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping opacity-50" />}
              <circle
                r="6"
                fill={aspect.trauma ? "#ef4444" : "#22d3ee"}
                filter="drop-shadow(0 0 4px rgba(34, 211, 238, 0.5))"
              />
              <text
                y="-12"
                textAnchor="middle"
                className="text-[10px] fill-cyan-100 font-mono tracking-tighter opacity-70 pointer-events-none select-none"
              >
                {aspect.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface Aspect {
  id: number;
  name: string;
  active: boolean;
  trauma: boolean;
  speed: number;
  radius: number;
  angleOffset: number;
}

interface LogMessage {
  role: "system" | "user" | "diagnostic" | "image";
  text?: string;
  src?: string;
}

export default function MnemosphereConsole() {
  const [aspects, setAspects] = useState<Aspect[]>(() => {
    const arr: Aspect[] = [];
    for (let i = 0; i < TOTAL_ASPECTS; i++) {
      const name = `${BASE_ASPECTS[i % BASE_ASPECTS.length]} ${Math.floor(i / BASE_ASPECTS.length) + 1}`;
      const baseSpeed = 0.1 + (i / (TOTAL_ASPECTS - 1)) * 2.9;

      arr.push({
        id: i,
        name,
        active: true,
        trauma: false,
        speed: baseSpeed,
        radius: 60 + (i % 8) * 15,
        angleOffset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  });

  const [soulAge, setSoulAge] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const requestRef = useRef<number>();

  const [neuralState, setNeuralState] = useState({
    gain: 1.4,
    noise: 0.001,
    injectionTrigger: 0,
    label: "HOMEOSTASIS",
    entropyMultiplier: 1.0,
  });

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<LogMessage[]>([
    { role: "system", text: "Console Online. Initializing Wavefront..." },
  ]);

  const isDead = soulAge >= MAX_AGE;

  useEffect(() => {
    const animate = () => {
      if (isPlaying && !isDead) {
        setSoulAge((prevAge) => {
          if (prevAge >= MAX_AGE) {
            setIsPlaying(false);
            setChatLog((p) => [
              ...p,
              { role: "system", text: "CRITICAL FAILURE. ENTROPY LIMIT REACHED. SYSTEM TERMINATED." },
            ]);
            return MAX_AGE;
          }

          let entropy = 1.0;

          if (neuralState.label === "TRAUMA CASCADE") entropy = 10.0;
          else if (neuralState.label === "DIVERGENT") entropy = 2.5;
          else if (neuralState.label === "HOMEOSTASIS") entropy = 0.5;

          return prevAge + BASE_AGING_RATE * entropy;
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, neuralState.label, isDead]);

  const activeTrauma = useMemo(() => aspects.some((a) => a.trauma), [aspects]);

  useEffect(() => {
    let resonanceCount = 0;
    for (let i = 0; i < aspects.length; i++) {
      for (let j = i + 1; j < aspects.length; j++) {
        if (Math.abs(aspects[i].speed - aspects[j].speed) <= RESONANCE_THRESHOLD) resonanceCount++;
      }
    }

    if (activeTrauma)
      setNeuralState((p) => ({ ...p, gain: 1.8 + Math.random() * 0.2, label: "TRAUMA CASCADE", noise: 0.02, entropyMultiplier: 10.0 }));
    else if (resonanceCount > 3)
      setNeuralState((p) => ({ ...p, gain: 1.45, label: "RESONANT FLOW", noise: 0.002, entropyMultiplier: 1.0 }));
    else if (aspects[0].speed < 0.6)
      setNeuralState((p) => ({ ...p, gain: 1.0, label: "HOMEOSTASIS", noise: 0.001, entropyMultiplier: 0.5 }));
    else setNeuralState((p) => ({ ...p, gain: 1.2, label: "DIVERGENT", noise: 0.001, entropyMultiplier: 2.5 }));
  }, [aspects, activeTrauma]);

  const toggleTrauma = (index: number) => {
    if (isDead) return;
    setAspects((prev) => {
      const copy = [...prev];
      copy[index].trauma = !copy[index].trauma;
      return copy;
    });
    setNeuralState((p) => ({ ...p, injectionTrigger: p.injectionTrigger + 1 }));
  };

  const updateSpeed = (index: number, val: string) => {
    if (isDead) return;
    setAspects((prev) => {
      const copy = [...prev];
      copy[index].speed = parseFloat(val);
      return copy;
    });
  };

  const speak = async (text: string) => {
    if (isMuted || !apiKey) return;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Fenrir" } },
              },
            },
          }),
        }
      );
      const data = await response.json();
      const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const audioUrl = pcmToWav(audioData);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (e) {
      console.error("TTS Failed", e);
    }
  };

  const handleDream = async () => {
    if (isProcessing || isDead) return;
    setIsProcessing(true);
    setChatLog((p) => [...p, { role: "system", text: "✨ INITIATING NEURAL VISUALIZATION..." }]);

    try {
      const traumaDesc = activeTrauma
        ? "fractured, glitching red artifacts, chaotic noise, anxiety"
        : "smooth flow, bioluminescent cyan, sacred geometry, calm";
      const speedDesc = neuralState.label === "DIVERGENT" ? "high speed motion blur" : "stillness, frozen in time";
      const prompt = `Abstract generative art representing a digital consciousness. The state is ${neuralState.label}. Visual elements: ${traumaDesc}, ${speedDesc}. Style: Ethereal data-moshing, ferrofluid, glowing neural networks, dark background.`;

      if (!apiKey) {
        await new Promise((r) => setTimeout(r, 2000));
        setChatLog((p) => [
          ...p,
          { role: "image", src: "https://placehold.co/400x300/1e293b/22d3ee?text=Neural+Dream+Visualization" },
        ]);
      } else {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instances: { prompt }, parameters: { sampleCount: 1 } }),
          }
        );
        const data = await response.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          setChatLog((p) => [...p, { role: "image", src: `data:image/png;base64,${b64}` }]);
        } else {
          throw new Error("No image data");
        }
      }
    } catch (e) {
      setChatLog((p) => [...p, { role: "system", text: "VISUALIZATION FAILED." }]);
    }
    setIsProcessing(false);
  };

  const handleDiagnostic = async () => {
    if (isProcessing || isDead) return;
    setIsProcessing(true);
    setChatLog((p) => [...p, { role: "system", text: "✨ RUNNING DEEP HEURISTIC SCAN..." }]);

    try {
      const stateSummary = JSON.stringify(
        aspects.map((a) => ({ name: a.name, speed: a.speed.toFixed(1), trauma: a.trauma }))
      );
      const prompt = `You are the System Architect. Analyze this cognitive state map: ${stateSummary}. \\n      Current Entropy: ${neuralState.entropyMultiplier}x.\\n      Provide a cryptic, medical, or philosophical prognosis of the soul's current integrity. Max 40 words. Speak clinically.`;

      if (!apiKey) {
        await new Promise((r) => setTimeout(r, 1500));
        const mockText =
          "DIAGNOSTIC: Logic circuits operating at 80% efficiency. Emotional dampeners active. Recommendation: Increase empathy resonance to prevent localized entropy spikes.";
        setChatLog((p) => [...p, { role: "diagnostic", text: mockText }]);
      } else {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          setChatLog((p) => [...p, { role: "diagnostic", text }]);
          speak(text);
        }
      }
    } catch (e) {
      setChatLog((p) => [...p, { role: "system", text: "DIAGNOSTIC FAILED." }]);
    }
    setIsProcessing(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing || isDead) return;
    const userText = input;
    setInput("");
    setIsProcessing(true);
    setChatLog((p) => [...p, { role: "user", text: userText }]);

    try {
      let result: { reply: string; adjustments: Array<{ targetBaseName: string; speed?: number; trauma?: boolean }> } = {
        reply: "Signal interference.",
        adjustments: [],
      };

      if (!apiKey) {
        await new Promise((r) => setTimeout(r, 1500));
        const randomAspectName = BASE_ASPECTS[Math.floor(Math.random() * BASE_ASPECTS.length)];
        result = {
          reply: `[SIMULATION] Processing vector "${userText}". Adjusting ${randomAspectName} resonance.`,
          adjustments: [
            { targetBaseName: randomAspectName, speed: Math.random() * 2 + 0.5, trauma: false },
          ],
        };
      } else {
        const payload = {
          contents: [
            {
              parts: [{ text: userText }],
            },
          ],
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
        );
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) result = JSON.parse(jsonMatch[0]);
        }
      }

      if (result.adjustments) {
        let burst = 0;
        let traumaHealed = 0;

        setAspects((prev) => {
          const next = [...prev];
          result.adjustments.forEach((adj) => {
            next.forEach((aspect) => {
              if (aspect.name.includes(adj.targetBaseName)) {
                if (adj.speed !== undefined) aspect.speed = adj.speed;
                if (adj.trauma !== undefined) {
                  if (aspect.trauma !== adj.trauma) {
                    if (adj.trauma) burst = 1;
                    else traumaHealed = 1;
                  }
                  aspect.trauma = adj.trauma;
                }
              }
            });
          });
          return next;
        });

        if (traumaHealed) {
          setSoulAge((prev) => Math.max(0, prev - 5.0));
          setChatLog((p) => [...p, { role: "system", text: "TRAUMA RESOLVED. LIFE INTEGRITY RESTORED." }]);
        }

        if (burst) setNeuralState((p) => ({ ...p, injectionTrigger: p.injectionTrigger + 1 }));
      }
      setChatLog((p) => [...p, { role: "system", text: result.reply }]);
    } catch (e) {
      console.error(e);
      setChatLog((p) => [...p, { role: "system", text: "Connection failure." }]);
    }
    setIsProcessing(false);
  };

  return (
    <div className="h-screen w-full bg-slate-950 overflow-hidden relative font-sans text-slate-200">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <CriticalityCanvas {...neuralState} traumaActive={activeTrauma} isDead={isDead} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center -translate-y-24 scale-110">
          <Mnemosphere aspects={aspects} soulAge={soulAge} onToggleTrauma={toggleTrauma} isDead={isDead} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center px-4 md:px-12 pb-0 overflow-x-auto overflow-y-hidden">
        <div className="flex items-end gap-1.5 p-4 pb-0 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-sm rounded-t-3xl border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          {aspects.map((aspect, i) => (
            <div
              key={aspect.id}
              className={`relative group flex flex-col justify-end transition-all duration-300 ease-out ${
                isDead ? "opacity-50 grayscale" : ""
              }`}
              style={{
                height: `${120 + aspect.speed * 60}px`,
                width: "36px",
              }}
            >
              <div
                className={`w-full h-full rounded-t-lg border-t border-x relative overflow-hidden transition-colors duration-300
                  ${
                    aspect.trauma
                      ? "bg-rose-950/80 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                      : "bg-slate-900/80 border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400"
                  }
                `}
              >
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-300 opacity-30
                    ${aspect.trauma ? "bg-rose-500" : "bg-cyan-500"}
                  `}
                  style={{ height: `${(aspect.speed / 3) * 100}%` }}
                />

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[9px] font-mono tracking-widest text-slate-400 opacity-70 origin-center">
                  {aspect.name.split(" ")[0]}
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={aspect.speed}
                  disabled={isDead}
                  onChange={(e) => updateSpeed(i, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                  title={`${aspect.name}: ${aspect.speed.toFixed(1)}x`}
                />
              </div>

              <button
                onClick={() => toggleTrauma(i)}
                className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-30"
              >
                <AlertTriangle
                  size={14}
                  className={aspect.trauma ? "text-rose-500 fill-rose-500/20" : "text-slate-500 hover:text-rose-400"}
                />
              </button>
            </div>
          ))}

          <div className="ml-4 w-80 h-[400px] bg-slate-900/90 border border-slate-700 rounded-t-2xl flex flex-col shadow-2xl relative z-30">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-950/50 rounded-t-2xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest">
                <Sparkles size={12} /> CORE LINK
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => !isDead && handleDream()}
                  title="Generate Dream"
                  disabled={isProcessing || isDead}
                  className="text-slate-500 hover:text-cyan-400 disabled:opacity-30"
                >
                  <Eye size={12} />
                </button>
                <button
                  onClick={() => !isDead && handleDiagnostic()}
                  title="Run Diagnostic"
                  disabled={isProcessing || isDead}
                  className="text-slate-500 hover:text-cyan-400 disabled:opacity-30"
                >
                  <FileText size={12} />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  className={`text-slate-500 hover:text-cyan-400 ${isMuted ? "opacity-50" : ""}`}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
                <div className="w-px h-3 bg-slate-700 mx-1" />
                <button
                  onClick={() => {
                    setSoulAge(0);
                    setIsPlaying(true);
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  <RotateCcw size={12} />
                </button>
                <button
                  onClick={() => !isDead && setIsPlaying(!isPlaying)}
                  className={`text-slate-500 hover:text-white ${isDead ? "opacity-20 cursor-not-allowed" : ""}`}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
              {chatLog.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}-${msg.text ?? msg.src}`}
                  className={`p-2 rounded border ${
                    msg.role === "system"
                      ? "bg-slate-950 border-slate-800 text-cyan-100/80 font-mono"
                      : msg.role === "diagnostic"
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200 font-mono"
                        : msg.role === "image"
                          ? "bg-transparent border-none p-0"
                          : "bg-indigo-950/30 border-indigo-500/20 text-indigo-100 ml-4"
                  }`}
                >
                  {msg.role === "image" ? (
                    <div className="relative group">
                      {msg.src ? (
                        <img
                          src={msg.src}
                          alt="Neural Dream"
                          className="w-full rounded border border-cyan-900/50 shadow-lg"
                        />
                      ) : null}
                      <div className="absolute bottom-2 right-2 text-[9px] bg-black/50 text-white px-1 rounded">
                        DREAM.PNG
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="text-slate-500 flex gap-2 items-center px-2">
                  <Loader2 size={12} className="animate-spin" /> Synchronizing...
                </div>
              )}
              <div className="h-4" />
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isDead ? "System Offline" : "Inject semantic vector..."}
                  disabled={isProcessing || isDead}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 pr-8 text-xs text-white focus:border-cyan-500 outline-none transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isProcessing || isDead}
                  className="absolute right-1 top-1 p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-600 font-mono uppercase">
                  <span>STATUS: {isDead ? "TERMINATED" : neuralState.label}</span>
                  <span className={isDead ? "text-red-500" : ""}>
                    {soulAge.toFixed(1)} / {MAX_AGE} YRS
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      isDead ? "bg-red-900" : "bg-gradient-to-r from-cyan-500 to-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, (1 - soulAge / MAX_AGE) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-700 font-mono">
                  <span className="flex items-center gap-1">
                    <Activity size={8} /> ENTROPY: {neuralState.entropyMultiplier}x
                  </span>
                  <span>INTEGRITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
