"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRightLeft, Beaker, CloudRain, Scissors, Sprout, Sun } from "lucide-react";
import { supabase } from "../lib/supabase";


const weatherSummary = {
  location: "San Jose, CA",
  updatedFor: "April 7–13, 2026",
  outlook: "Warm midweek, then showers Thursday through Sunday.",
  warmHigh: 76,
  rainyDays: ["Thursday", "Friday", "Saturday", "Sunday"],
  coolNights: true,
};



const basePlants = [
  { name: "Basil: Sweet italian large leaf", type: "Herbs", schedule: { April: "Indoor Start / Direct Sow", May: "Indoor Start / Direct Sow / Cuttings", July: "Cuttings" } },
  { name: "Holy basil: Tulsi", type: "Herbs", schedule: { April: "Indoor Start / Direct Sow", May: "Indoor Start / Direct Sow / Cuttings" } },
  { name: "Bee Balm Lambada", type: "Outdoor Flowers", schedule: { April: "Transplant", May: "Softwood Cuttings" } },
  { name: "Bell pepper", type: "Pepper", schedule: { April: "Indoor grow tent hold / harden off soon" } },
  { name: "Biquinho pepper", type: "Pepper", schedule: { April: "Indoor grow tent hold / harden off soon" } },
  { name: "Black Eyed Susan", type: "Cut Flowers", schedule: { April: "Direct Sow" } },
  { name: "Bok Choy Baby Choi", type: "Saute", schedule: { April: "Harvest" } },
  { name: "Cantaloupe", schedule: { April: "Direct Sow" } },
  { name: "Carrots", schedule: { April: "Direct Sow" } },
  { name: "Chamomile German", schedule: { April: "Harvest" } },
  { name: "Corn Glass Gem", schedule: { April: "Direct Sow (ground preferred)" } },
  { name: "Cosmos Diablo", schedule: { April: "Direct Sow" } },
  { name: "Cucumber Lemon", schedule: { April: "Direct Sow" } },
  { name: "Dahlia Decorative Double Blend", schedule: { April: "Plant Outdoors" } },
  { name: "Dahlia Flowered Zinnia", schedule: { April: "Direct Sow" } },
  { name: "Eggplant Black Beauty", schedule: { April: "Indoor grow tent hold / harden off soon" } },
  { name: "Flower Mix Edible Beauties", schedule: { April: "Spring Seeds" } },
  { name: "Flower Mix Hummingbird Haven", schedule: { April: "Spring Seeds" } },
  { name: "Green Onion", schedule: { April: "Cuttings" } },
  { name: "Milkweed, Tweedia", schedule: { April: "Transplant" } },
  { name: "Onion Shallot", schedule: { April: "Transplant" } },
  { name: "Pea Sugar Ann Snap Pea", schedule: { April: "Direct Sow" } },
  { name: "Shiso/Perilla, Green & Red", schedule: { April: "Transplant / Direct Sow" } },
  { name: "Winter Squash", schedule: { April: "Direct Sow" } },
  { name: "Zinnia Thumbelina", type: "Cut Flowers", schedule: { April: "Direct Sow" } },
  { name: "Lettuce Mini Romaine", type: "Salads", schedule: { April: "Established cool crop" } },
  { name: "Arugula, Rocket", type: "Salads", schedule: { April: "Established cool crop" } },
  { name: "Cilantro", type: "Herbs", schedule: { April: "Established cool crop" } },
  { name: "Tomato", schedule: { April: "Indoor grow tent hold / harden off soon" } },
  { name: "Pepperoncini", type: "Pepper", schedule: { April: "Indoor grow tent hold / harden off soon" } }
];

function getFlags(plant, month) {
  const a = (plant.schedule?.[month] || "").toLowerCase();
  const name = plant.name.toLowerCase();
  return {
    germinate: /indoor|tray|tent|ziploc|seed|spring seeds|direct sow/i.test(a),
    cuttings: /cuttings/i.test(a),
    transplant: /transplant|plant outdoors|harden off/i.test(a),
    fertilize: /established|harvest|harden off|outdoors/i.test(a) || /pepper|tomato|eggplant|basil/.test(name),
  };
}

function getUrgency(plant, month) {
  const a = (plant.schedule?.[month] || "").toLowerCase();
  const name = plant.name.toLowerCase();
  const flags = getFlags(plant, month);

  if (flags.transplant && weatherSummary.rainyDays.length) {
    return {
      level: "High",
      reason: "Transplant carefully around incoming rain. Harden off first and avoid waterlogged soil.",
      color: "bg-rose-100 text-rose-800"
    };
  }

  if ((name.includes("lettuce") || name.includes("arugula") || name.includes("cilantro") || name.includes("bok choy")) && weatherSummary.warmHigh >= 75) {
    return {
      level: "High",
      reason: "Warm afternoons increase bolting risk. Harvest early and keep moisture steady.",
      color: "bg-amber-100 text-amber-800"
    };
  }

  if (flags.germinate && /direct sow/.test(a) && weatherSummary.rainyDays.length) {
    return {
      level: "Medium",
      reason: "Good sowing window, but rain can crust or oversaturate soil. Sow shallowly and monitor drainage.",
      color: "bg-sky-100 text-sky-800"
    };
  }

  if ((name.includes("tomato") || name.includes("pepper") || name.includes("eggplant")) && weatherSummary.coolNights) {
    return {
      level: "Medium",
      reason: "Grow tent seedlings are close, but cool nights still favor a cautious hardening-off period.",
      color: "bg-violet-100 text-violet-800"
    };
  }

  if (flags.cuttings) {
    return {
      level: "Medium",
      reason: "Take cuttings during active growth and keep them protected in the tent or bright indirect light.",
      color: "bg-fuchsia-100 text-fuchsia-800"
    };
  }

  if (flags.fertilize) {
    return {
      level: "Medium",
      reason: "Active spring growth means this plant may benefit from a light feeding soon.",
      color: "bg-emerald-100 text-emerald-800"
    };
  }

  return {
    level: "Low",
    reason: "Nothing urgent right now beyond routine monitoring.",
    color: "bg-slate-100 text-slate-700"
  };
}

function getActionGuide(plant, month) {
  const a = (plant.schedule?.[month] || "").toLowerCase();
  const n = plant.name.toLowerCase();

  if (/direct sow/.test(a) && (n.includes("carrot") || n.includes("pea") || n.includes("corn"))) {
    return "Direct sow now. Keep seed zone evenly moist until germination, and do not let spring rain compact the surface.";
  }
  if (/direct sow/.test(a) && (n.includes("zinnia") || n.includes("cosmos") || n.includes("flower"))) {
    return "Direct sow now in sun. Lightly cover seeds and thin early for airflow.";
  }
  if (/indoor|tent|seed/.test(a) || n.includes("tomato") || n.includes("pepper") || n.includes("eggplant")) {
    return "Use the grow tent now. Strong light and warm roots are working in your favor; harden off gradually before outdoor moves.";
  }
  if (/cuttings/.test(a)) {
    return "Take fresh, non-woody cuttings and root them in high humidity with gentle light. Your grow tent is useful for this.";
  }
  if (/transplant|plant outdoors|harden off/.test(a)) {
    return "Transplant in a mild weather window, ideally before the rain or after soil drains. Ease tent-grown plants into outdoor sun gradually.";
  }
  return "Monitor growth, moisture, and weather, then act when the plant shows active spring momentum.";
}

function chipData(flags) {
  const out = [];
  if (flags.germinate) out.push({ label: "Germinate", color: "bg-blue-100 text-blue-800", icon: Sprout });
  if (flags.cuttings) out.push({ label: "Cuttings", color: "bg-purple-100 text-purple-800", icon: Scissors });
  if (flags.transplant) out.push({ label: "Transplant", color: "bg-amber-100 text-amber-800", icon: ArrowRightLeft });
  if (flags.fertilize) out.push({ label: "Fertilize", color: "bg-emerald-100 text-emerald-800", icon: Beaker });
  return out;
}

function getPlantDetails(plant) {
  const n = (plant?.name || "").toLowerCase();
  let ph = "6.0–7.0";
  let description = "General garden plant profile based on your planning sheet and current monthly action.";
  let fertilizer = "Light compost or balanced fertilizer during active growth; avoid feeding stressed or waterlogged plants.";
  let signs = "Feed when growth is pale, slow, or weak compared with nearby healthy plants.";

  if (n.includes("basil") || n.includes("tulsi")) {
    ph = "6.0–7.5";
    description = "Warm-season herb that grows quickly with steady warmth, strong light, and regular cutting. Your grow tent makes this an excellent indoor candidate right now.";
    fertilizer = "Use worm castings or a light liquid feed every 2–3 weeks during active growth, especially in containers or the grow tent.";
    signs = "Feed when new leaves are small, pale, or growth slows after repeated harvesting.";
  } else if (n.includes("tomato")) {
    ph = "6.2–6.8";
    description = "Sun-loving fruiting plant that wants steady moisture, airflow, and gradual hardening off before outdoor life.";
    fertilizer = "Use compost at planting and light feeding through vegetative growth, then continue moderate feeding as flowers and fruit develop.";
    signs = "Feed when lower leaves pale, growth slows, or fruiting looks weak despite good light.";
  } else if (n.includes("pepper") || n.includes("eggplant")) {
    ph = "6.0–6.8";
    description = "Heat-loving crop that benefits from your grow tent while nights are still cool outside.";
    fertilizer = "Use balanced feeding during active growth and continue lightly once hardened off and transplanted.";
    signs = "Feed when plants stall, leaves lose deep green color, or flowering looks weak.";
  } else if (n.includes("lettuce") || n.includes("bok choy") || n.includes("arugula") || n.includes("cilantro")) {
    ph = "6.0–7.0";
    description = "Cool-season crop that grows quickly now but can bolt once warm afternoons stack up.";
    fertilizer = "Use gentle nitrogen support only if regrowth slows or leaves pale.";
    signs = "Feed when leaves are thin, pale, or recovery after harvest is weak.";
  } else if (n.includes("carrot") || n.includes("pea") || n.includes("corn")) {
    ph = n.includes("corn") ? "6.0–6.8" : "6.0–7.0";
    description = "Direct-sown crop that depends on moisture consistency and good soil contact during early establishment.";
    fertilizer = n.includes("corn") ? "Corn is a heavier feeder and benefits from light feeding after establishment." : "Use compost lightly before sowing; do not overfeed seedlings.";
    signs = "Feed when growth is weak, pale, or clearly lagging after establishment.";
  } else if (n.includes("zinnia") || n.includes("cosmos") || n.includes("flower") || n.includes("dahlia")) {
    ph = "6.0–7.2";
    description = "Flowering plant that wants sun, airflow, and time to root before it really takes off.";
    fertilizer = "Use compost at planting and a light bloom-supporting feed after establishment if growth is weak.";
    signs = "Feed when stems stay thin, foliage pales, or bloom production drops.";
  }

  return { ph, description, fertilizer, signs };
}

  const months = [
    "January",
    "February",
    "March",
   "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  
export default function ClickGardenWebsite() {
  const [monthFilter, setMonthFilter] = useState("April");
  const [plantsData, setPlantsData] = useState([]);
  const [selectedPlantName, setSelectedPlantName] = useState(basePlants[0]?.name || "");

  const [newPlant, setNewPlant] = useState({
    name: "",
    type: "",
    month: months[new Date().getMonth()],
    action: "",
    ph: "",
    description: "",
    fertilizer: "",
    signs: ""
  });


async function addPlant() {
  if (!newPlant.name) return;

  const { data, error } = await supabase
    .from("plants")
    .insert([
      {
        name: newPlant.name,
        type: newPlant.type,
        schedule: {
          [newPlant.month]: newPlant.action
        },
        ph: newPlant.ph,
        description: newPlant.description,
        fertilizer: newPlant.fertilizer || "",
        signs: newPlant.signs || ""
      }
    ])
    .select();

  if (error) {
    console.log("ERROR:", error);
  } else {
	  setPlantsData((prev) => [...prev, ...data]);
		setNewPlant({
			  name: "",
			  type: "",
			  month: months[new Date().getMonth()],
			  action: "",
			  ph: "",
			  description: "",
			  fertilizer: "",
			  signs: ""
			});
  }
}

async function autoFillPlant() {
  if (!newPlant.name) return;

  const search = newPlant.name.toLowerCase();

  // 🔹 STEP 1: find matches in DB
  const matches = plantsData.filter((p) =>
    p.name.toLowerCase().includes(search)
  );

  const match = matches.length ? matches[0] : null;

  if (match) {
    console.log("FOUND DB MATCH:", match);

    const hasGoodData =
      match.description &&
      match.description !== "EMPTY" &&
      match.description.trim() !== "";

    // 🔥 If DB is good → use it
    if (hasGoodData) {
      console.log("USING DB MATCH");

      setNewPlant((prev) => ({
        ...prev,
        name: match.name,
        type: match.type || "",
        ph: match.ph || "",
        description: match.description || "",
        fertilizer: match.fertilizer || "",
        signs: match.signs || "",
        month: match.schedule ? Object.keys(match.schedule)[0] : prev.month,
        action: match.schedule ? Object.values(match.schedule)[0] : "",
      }));

      return;
    }

    console.log("DB incomplete → using API instead");
  }

  // 🔹 STEP 2: fallback to API
  try {
    console.log("USING API FALLBACK");

    const res = await fetch("/api/autofill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plantName: newPlant.name }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    console.log("API RESPONSE:", data);

    setNewPlant((prev) => ({
      ...prev,
      name: data.name || prev.name,
      type: data.type || "",
      ph: data.ph || "",
      description: data.description || "",
      fertilizer: data.fertilizer || "",
      signs: data.signs || "",
      month: data.schedule ? Object.keys(data.schedule)[0] : prev.month,
      action: data.schedule ? Object.values(data.schedule)[0] : "",
    }));

    // 🔥 OPTIONAL: enrich DB automatically (HIGHLY recommended)
    await supabase
      .from("plants")
      .update({
        description: data.description,
        ph: data.ph,
        fertilizer: data.fertilizer,
        signs: data.signs,
      })
      .eq("name", data.name);

    console.log("DB UPDATED WITH API DATA");

  } catch (err) {
    console.error("AUTOFILL ERROR:", err);
    alert("Autofill failed");
  }
}


const currentMonthPlants = useMemo(() => {
  const source = plantsData.length ? plantsData : basePlants;
  return source.filter((p) => p.schedule?.[monthFilter]);
}, [plantsData, monthFilter]);

  useEffect(() => {
    if (!currentMonthPlants.find((p) => p.name === selectedPlantName)) {
      setSelectedPlantName(currentMonthPlants[0]?.name || basePlants[0]?.name || "");
    }
  }, [currentMonthPlants, selectedPlantName]);
  
  useEffect(() => {
  async function fetchPlants() {
    const { data, error } = await supabase
      .from("plants")
      .select("*");

    if (error) {
      console.log("FETCH ERROR:", error);
    } else {
      console.log("FETCHED:", data);
      setPlantsData(data);
    }
  }

  fetchPlants();
}, []);
  const buckets = useMemo(() => {
    const rows = currentMonthPlants.map((p) => ({ plant: p, flags: getFlags(p, monthFilter), urgency: getUrgency(p, monthFilter) }));
    return {
      germinate: rows.filter((r) => r.flags.germinate),
      cuttings: rows.filter((r) => r.flags.cuttings),
      transplant: rows.filter((r) => r.flags.transplant),
      fertilize: rows.filter((r) => r.flags.fertilize),
      urgent: rows.filter((r) => r.urgency.level === "High"),
    };
  }, [currentMonthPlants, monthFilter]);

  const selectedPlant = currentMonthPlants.find((p) => p.name === selectedPlantName) || currentMonthPlants[0] || basePlants[0];
  const selectedDetails = getPlantDetails(selectedPlant);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0fdf4,_#ffffff_45%,_#f8fafc)] p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Click Garden</div>
              <h1 className="mt-3 text-2xl font-bold text-green-950 sm:text-4xl">Smarter monthly assistant</h1>
					<div className="mt-4 space-y-3">
					  <input
						placeholder="Plant name"
						value={newPlant.name}
						onChange={(e) =>
						  setNewPlant({ ...newPlant, name: e.target.value })
						}
						className="border p-2 rounded w-full"
					  />
					  <input
						placeholder="Type"
						value={newPlant.type}
						onChange={(e) =>
						  setNewPlant({ ...newPlant, type: e.target.value })
						}
						className="border p-2 rounded w-full"
					  />
					  <input
						placeholder="Action (e.g. Direct sow)"
						value={newPlant.action}
						onChange={(e) =>
						  setNewPlant({ ...newPlant, action: e.target.value })
						}
						className="border p-2 rounded w-full"
					  />
					  <button
						onClick={autoFillPlant}
						className="bg-blue-600 text-white px-4 py-2 rounded"
					  >
						Auto Fill
					  </button>
					  <button
						onClick={addPlant}
						className="bg-green-700 text-white px-4 py-2 rounded"
					  >
						Add Plant
					  </button>
					</div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">This view keeps the quick answers you asked for while bringing back clickable plant details like pH, descriptions, and fertilizer notes.</p>
            </div>
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-400">
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700"><AlertTriangle className="h-4 w-4" />Urgent now</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{buckets.urgent.length}</div>
            <div className="mt-1 text-xs text-slate-500">Weather-sensitive items this week</div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-700"><Sprout className="h-4 w-4" />Germinate</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{buckets.germinate.length}</div>
            <div className="mt-1 text-xs text-slate-500">Seeds or starts to begin now</div>
          </div>
          <div className="rounded-3xl border border-purple-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-purple-700"><Scissors className="h-4 w-4" />Cuttings</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{buckets.cuttings.length}</div>
            <div className="mt-1 text-xs text-slate-500">Good candidates for propagation</div>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700"><ArrowRightLeft className="h-4 w-4" />Transplant</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{buckets.transplant.length}</div>
            <div className="mt-1 text-xs text-slate-500">Outdoor moves and hardening off</div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700"><Beaker className="h-4 w-4" />Fertilize</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{buckets.fertilize.length}</div>
            <div className="mt-1 text-xs text-slate-500">Plants likely entering feed-demand growth</div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Weather + urgency</h2>
                <p className="mt-1 text-sm text-slate-500">Based on San Jose weather for {weatherSummary.updatedFor}.</p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-2 text-sm text-sky-900">
                {weatherSummary.outlook}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-800"><Sun className="h-4 w-4" />Warmest day</div>
                <div className="mt-2 text-sm leading-6 text-slate-700">Midweek peaks around {weatherSummary.warmHigh}F, which raises bolting stress for lettuce, arugula, bok choy, and cilantro.</div>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4">
                <div className="flex items-center gap-2 text-sky-800"><CloudRain className="h-4 w-4" />Rain risk</div>
                <div className="mt-2 text-sm leading-6 text-slate-700">Showers are expected {weatherSummary.rainyDays.join(", ")}. Transplants and direct-sown beds need drainage awareness, not blind watering.</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4">
                <div className="flex items-center gap-2 text-violet-800"><Sprout className="h-4 w-4" />Grow tent advantage</div>
                <div className="mt-2 text-sm leading-6 text-slate-700">Tomatoes, peppers, eggplant, basil, and other starts can stay under strong tent light a little longer while you harden them off gradually.</div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-4 self-start">
            <h2 className="text-xl font-semibold text-slate-900">Right now in {monthFilter}</h2>
            <p className="mt-1 text-sm text-slate-500">Quick answers that stay visible on desktop and move above the plant list on phones.</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <div className="rounded-2xl bg-blue-50 p-4"><strong>🌱 Seeds to germinate right now:</strong> {buckets.germinate.slice(0, 6).map((r) => r.plant.name).join(", ") || "None right now."}</div>
              <div className="rounded-2xl bg-purple-50 p-4"><strong>✂️ Cuttings to take now:</strong> {buckets.cuttings.slice(0, 6).map((r) => r.plant.name).join(", ") || "None right now."}</div>
              <div className="rounded-2xl bg-amber-50 p-4"><strong>🔁 Plants to transplant now:</strong> {buckets.transplant.slice(0, 6).map((r) => r.plant.name).join(", ") || "None right now."}</div>
              <div className="rounded-2xl bg-emerald-50 p-4"><strong>🧪 Plants to fertilize now:</strong> {buckets.fertilize.slice(0, 6).map((r) => r.plant.name).join(", ") || "None right now."}</div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Plant library highlights</h2>
              <p className="mt-1 text-sm text-slate-500">Tap a plant to view details again. pH values, descriptions, fertilizer notes, and actions are back.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">Tap any plant</div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-3">
              {currentMonthPlants.map((plant) => {
                const flags = getFlags(plant, monthFilter);
                const urgency = getUrgency(plant, monthFilter);
                const active = plant.name === selectedPlant?.name;
                return (
                  <button
                    key={plant.name}
                    onClick={() => setSelectedPlantName(plant.name)}
                    className={`rounded-2xl border p-4 text-left transition ${active ? "border-green-300 bg-green-50/70 shadow-sm" : "border-slate-100 bg-white hover:bg-slate-50"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900">{plant.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{plant.schedule?.[monthFilter]}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {chipData(flags).map((chip) => {
                            const Icon = chip.icon;
                            return <span key={chip.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${chip.color}`}><Icon className="h-3 w-3" />{chip.label}</span>;
                          })}
                        </div>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold ${urgency.color}`}>{urgency.level} urgency</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 xl:sticky xl:top-4 self-start">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedPlant?.name || "Select a plant"}</h3>
                  <div className="mt-1 text-sm text-slate-500">{selectedPlant?.schedule?.[monthFilter] || "No current action"}</div>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{monthFilter}</div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Target pH</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{selectedDetails.ph}</div>
                </div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Description</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">{selectedDetails.description}</div>
                </div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Why now</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">{getUrgency(selectedPlant, monthFilter).reason}</div>
                </div>
                <div className="rounded-xl bg-green-50 p-3 ring-1 ring-green-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">What to do</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">{getActionGuide(selectedPlant, monthFilter)}</div>
                </div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Fertilizer notes</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">{selectedDetails.fertilizer}</div>
                </div>
                <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Signs it is time to feed</div>
                  <div className="mt-1 text-sm leading-6 text-slate-700">{selectedDetails.signs}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
