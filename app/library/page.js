
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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

const weatherSummary = {
  location: "San Jose, CA",
  updatedFor: "April 7–13, 2026",
  outlook: "Warm midweek, then showers Thursday through Sunday.",
  warmHigh: 76,
  rainyDays: ["Thursday", "Friday", "Saturday", "Sunday"],
  coolNights: true,
};

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


export default function PlantLibrary() {
  const [plants, setPlants] = useState([]);
  const [selectedPlantName, setSelectedPlantName] = useState("");
  const selectedPlant = plants.length > 0 ? plants.find((p) => p.name === selectedPlantName) || plants[0] : null;

const selectedDetails = selectedPlant
  ? getPlantDetails(selectedPlant)
  : { ph: "", description: "", fertilizer: "", signs: "" };
  useEffect(() => {
    async function fetchPlants() {
      const { data, error } = await supabase
        .from("plants")
        .select("*");

      if (error) {
          console.log("LIBRARY FETCH ERROR:", error);
        } else {
          setPlants(data);
          setSelectedPlantName(data[0]?.name || "");
        }
    }

    fetchPlants();
  }, []);

  return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">🌱 Plant Library</h1>

    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">

      {/* LEFT: LIST */}
      <div className="space-y-3">
        {plants.map((plant) => {
          const active = plant.name === selectedPlant?.name;

          return (
            <button
              key={plant.id}
              onClick={() => setSelectedPlantName(plant.name)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                active
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{plant.name}</div>
              <div className="text-sm text-slate-500">
                {plant.type}
              </div>
            </button>
          );
        })}
      </div>

      {/* RIGHT: DETAILS */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold">
          {selectedPlant?.name}
        </h2>

        <div className="mt-4 space-y-3 text-sm">

          <div>
            <div className="text-xs text-slate-500">Target pH</div>
            <div>{selectedDetails.ph}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Description</div>
            <div>{selectedDetails.description}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Why now</div>
            <div>{selectedPlant ? getUrgency(selectedPlant, "April").reason : ""}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">What to do</div>
            <div>{selectedPlant ? getActionGuide(selectedPlant, "April") : ""}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Fertilizer</div>
            <div>{selectedDetails.fertilizer}</div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Signs</div>
            <div>{selectedDetails.signs}</div>
          </div>

        </div>
      </div>

    </div>
  </div>
);
}
