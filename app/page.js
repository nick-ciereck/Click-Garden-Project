"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search, Sprout, CalendarDays, Heart, Sun, Package, FlaskConical, Save } from "lucide-react";

const months = ["March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February"];
const STORAGE_KEY = "click-garden-data-v1";

const basePlants = [
  { todo: false, name: "Alfalfa" },
  { todo: false, name: "Arugula", type: "Salads" },
  { todo: false, name: "Arugula, Rocket", type: "Salads", schedule: { March: "Direct Sow", September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Bachelor button cyanus double (cornflower)" },
  { todo: false, name: "Basil cuttings", type: "Herbs" },
  { todo: false, name: "Basil: Sweet italian large leaf", type: "Herbs", ph: "7.5+", schedule: { March: "Plug Tray Grow Tent", April: "Indoor Start / Direct Sow", May: "Indoor Start / Direct Sow / Cuttings", June: "Indoor Start / Direct Sow / Cuttings", July: "Cuttings", August: "Cuttings", September: "Cuttings", October: "Ziploc Indoor Start", November: "Plug Tray Grow Tent", December: "Plug Tray Grow Tent", January: "Plug Tray Grow Tent", February: "Ziploc Indoor Start" } },
  { todo: false, name: "Bee Balm Lambada", type: "Outdoor Flowers", schedule: { March: "Transplant", April: "Transplant", May: "Softwood Cuttings", June: "Softwood Cuttings", July: "Softwood Cuttings", January: "Indoor Start", February: "Indoor Start" } },
  { todo: false, name: "Beet" },
  { todo: false, name: "Bell pepper", type: "Pepper", schedule: { March: "Ziploc Grow Tent", January: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Biquinho pepper", type: "Pepper", schedule: { March: "Ziploc Grow Tent", January: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Black Eyed Susan", type: "Cut Flowers", schedule: { March: "Indoor Start / Direct Sow", April: "Direct Sow", May: "Direct Sow", January: "Indoor Start", February: "Indoor Start / Direct Sow" } },
  { todo: false, name: "Blue Lake Beans" },
  { todo: false, name: "Bok Choy Baby Choi", type: "Saute", schedule: { March: "Direct Sow / Harvest", April: "Harvest", May: "Harvest", September: "Direct Sow", October: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Broccoli", type: "Saute" },
  { todo: false, name: "Broccoli Raab", type: "Saute" },
  { todo: false, name: "Broccolini Aspabroc", type: "Saute", schedule: { September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Indoor Seed", January: "Indoor Seed" } },
  { todo: false, name: "Bumblebee Buffet Flower Mix", type: "Outdoor Flowers", mixedSeeds: "Siberian Wallflower, Camellia flowered Balsam, Yellow Lupine, Arroyo Lupine, Rocket-Larkspur Imperial Mix, Dahlia Flowered Zinnia, Purple Coneflower, Rocky Mountain Penstemon, Sensation Mix Cosmos, Gayfeather, White Prairie Clover, Lacy Phacelia, Purple Prairie Clover, Spurred Northern Lights Snapdragon, Blue Safe, Bergamot", schedule: { March: "Direct Sow (Second window)", April: "Direct Sow (Late Window)", October: "Direct Sow (best time)", November: "Direct Sow (best time)", December: "Direct Sow (best time)", January: "Direct Sow (Second window)", February: "Direct Sow (Second window)" } },
  { todo: false, name: "Burpee sweet corn" },
  { todo: false, name: "Butterfly Meadow Flower Mix", type: "Outdoor Flowers", mixedSeeds: "Candytuft, Siberian wallflower, CA orange poppy, perennial lupine, cornflower, Indian blanket, bishop's flower, aster, godetia, cosmos, plains coreopsis, sweet william, sweet alyssum, gayfeather, black-eyed susan, showy milkweed, phlox", schedule: { March: "Direct Sow (Second window)", April: "Direct Sow (Second window)", October: "Direct Sow (best time)", November: "Direct Sow (best time)", December: "Direct Sow (best time)", January: "Direct Sow (best time)", February: "Direct Sow (Second window)" } },
  { todo: false, name: "Butternut squash" },
  { todo: false, name: "Cabbage" },
  { todo: false, name: "Cacti (Mixed Seeds)", schedule: { March: "Grow tent start", April: "Grow tent start", May: "Grow tent start", June: "Grow tent start", January: "Grow tent start", February: "Grow tent start" } },
  { todo: false, name: "California poppy", schedule: { September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Camellia Flowered Balsam Touch-me-nots" },
  { todo: false, name: "Cantaloupe", schedule: { March: "Direct Sow", April: "Direct Sow", May: "Direct Sow", June: "Direct Sow" } },
  { todo: false, name: "cantaloupe hale's best jumbo" },
  { todo: false, name: "Carrot Tonda di Parigi (Short)", schedule: { October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Carrots", schedule: { March: "Direct Sow", April: "Direct Sow", September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Cat grass" },
  { todo: false, name: "Catnip" },
  { todo: false, name: "Chamomile" },
  { todo: false, name: "Chamomile German", schedule: { March: "Direct Sow / Harvest", April: "Harvest", May: "Harvest", January: "Direct sow / indoor tent", February: "Direct sow / indoor tent" } },
  { todo: false, name: "Cherokee wax bean bush" },
  { todo: false, name: "Cherry" },
  { todo: false, name: "Chives Common" },
  { todo: false, name: "Cilantro" },
  { todo: false, name: "Corn Glass Gem", schedule: { April: "Direct Sow (ground preferred)", May: "Direct Sow (ground preferred)", June: "Direct Sow (ground preferred)" } },
  { todo: false, name: "Cornflower" },
  { todo: false, name: "Cosmos Diablo", schedule: { March: "Indoor Start / Direct Sow", April: "Direct Sow", May: "Direct Sow", June: "Direct Sow", February: "Indoor Start" } },
  { todo: false, name: "Cucumber Lemon", schedule: { March: "Indoor Start / Direct Sow", April: "Direct Sow", May: "Direct Sow", June: "Direct Sow" } },
  { todo: false, name: "Cutting Celery" },
  { todo: false, name: "Dahlia Decorative Double Blend", schedule: { March: "Plant Outdoors", April: "Plant Outdoors", February: "Indoor Seed" } },
  { todo: false, name: "Dahlia Flowered Zinnia", schedule: { March: "Direct Sow", April: "Direct Sow", May: "Direct Sow" } },
  { todo: false, name: "Daisy" },
  { todo: false, name: "Dandelion" },
  { todo: false, name: "Delphinium Magic Fountains Mix" },
  { todo: false, name: "Dill" },
  { todo: false, name: "Dwarf sunflowers" },
  { todo: false, name: "Eastern Columbine" },
  { todo: false, name: "Echinacea" },
  { todo: false, name: "Eggplant Black Beauty", schedule: { March: "Indoor seed", January: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Fennel", schedule: { March: "Direct Sow", August: "Direct Sow", September: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Feverfew" },
  { todo: false, name: "Flower Mix Edible Beauties", mixedSeeds: "Borage, Nasturtium, Calendula, Bachelor's Button, Fennel, Radish, Arugula, Signet Marigold, Basil, Chives, Johnny Jump-Up", schedule: { March: "Spring Seeds", April: "Spring Seeds", October: "Winter Seeds", November: "Winter Seeds", December: "Winter Seeds", January: "Winter Seeds", February: "Winter Seeds" } },
  { todo: false, name: "Flower Mix Hummingbird Haven", mixedSeeds: "Nasturtium jewel mix, Lupine, Hollyhock single mix, Zinnia Pumila Mix, Butterfly Weed, Scarlet Sage, Phlox Annual, Rocket Larkspur, Spider Flower, Godetia, Bee Balm, Columbine Eastern, Penstemon, Standing Cypress, Foxglove, Flowering Tobacco, Coral Bells", schedule: { March: "Spring Seeds", April: "Spring Seeds", December: "Winter Seeds", January: "Winter Seeds", February: "Winter Seeds" } },
  { todo: false, name: "Forget me not" },
  { todo: false, name: "Foxglove" },
  { todo: false, name: "Garden sorrel" },
  { todo: false, name: "Gayfeather" },
  { todo: false, name: "Golden berry", schedule: { March: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Green Onion", schedule: { March: "Cuttings", April: "Cuttings", May: "Cuttings", June: "Cuttings", July: "Cuttings", August: "Cuttings", September: "Cuttings", October: "Cuttings", November: "Cuttings", December: "Cuttings", January: "Cuttings", February: "Cuttings" } },
  { todo: false, name: "Holy basil: Tulsi", type: "Herbs", schedule: { March: "Plug Tray Grow Tent", April: "Indoor Start / Direct Sow", May: "Indoor Start / Direct Sow / Cuttings", June: "Indoor Start / Direct Sow / Cuttings", July: "Cuttings", August: "Cuttings", September: "Cuttings", October: "Ziploc Indoor Start", November: "Plug Tray Grow Tent", December: "Plug Tray Grow Tent", January: "Plug Tray Grow Tent", February: "Ziploc Indoor Start" } },
  { todo: false, name: "Hollyhock" },
  { todo: false, name: "Iceberg lettuce", schedule: { September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Johnny Jump-Up" },
  { todo: false, name: "Kale" },
  { todo: false, name: "Larkspur Galilee Blend", schedule: { December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Lavender" },
  { todo: false, name: "Lettuce Mini Romaine", schedule: { September: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Indoor Start", January: "Indoor Start", February: "Indoor Start" } },
  { todo: false, name: "Love-in-a-Mist Miss Jekyll Blend", schedule: { March: "Direct Sow", October: "Direct Sow", November: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Lupine" },
  { todo: false, name: "Marigold" },
  { todo: false, name: "Milkweed Common", schedule: { March: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Milkweed, Showy", schedule: { October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Milkweed, Tweedia", schedule: { March: "Transplant", April: "Transplant", December: "Indoor Start", January: "Indoor Start", February: "Indoor Start" } },
  { todo: false, name: "Mint" },
  { todo: false, name: "Morning Glory" },
  { todo: false, name: "Nasturtium" },
  { todo: false, name: "Nasturtium Alaska Variegated" },
  { todo: false, name: "Nasturtium Fiesta Blend", schedule: { March: "Direct Sow", October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Oregano" },
  { todo: false, name: "Onion Flat of Italy", schedule: { March: "Transplant", June: "Harvest", July: "Harvest", August: "Harvest", October: "Starter Tray", November: "Starter Tray", December: "Starter Tray", January: "Starter Tray", February: "Starter Tray / Transplant" } },
  { todo: false, name: "Onion Shallot", schedule: { March: "Transplant", April: "Transplant", July: "Harvest", August: "Harvest", October: "Indoor Starter Tray", November: "Indoor Starter Tray", December: "Indoor Starter Tray", January: "Indoor Starter Tray", February: "Indoor Starter Tray" } },
  { todo: false, name: "Parsley" },
  { todo: false, name: "Pea Sugar Ann Snap Pea", schedule: { March: "Direct Sow", April: "Direct Sow" } },
  { todo: false, name: "Pepperoncini", type: "Pepper", schedule: { March: "Ziploc Grow Tent", January: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Perennial lupine" },
  { todo: false, name: "Phlox" },
  { todo: false, name: "Poppy Iceland Nudicaule Blend" },
  { todo: false, name: "Poppy Mother of Pearl", schedule: { October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow" } },
  { todo: false, name: "Portulaca" },
  { todo: false, name: "Purple Coneflower" },
  { todo: false, name: "Radish cherry belle" },
  { todo: false, name: "Ranunculus corms", schedule: { May: "Lift corms", June: "Lift corms", November: "Plant corms", December: "Plant corms", January: "Plant corms" } },
  { todo: false, name: "Rocket Larkspur Imperial Mix", schedule: { October: "Direct Sow", November: "Direct Sow", December: "Direct Sow", January: "Direct Sow", February: "Direct Sow" } },
  { todo: false, name: "Rosemary" },
  { todo: false, name: "Rudbeckia" },
  { todo: false, name: "Sage" },
  { todo: false, name: "Scarlet Sage" },
  { todo: false, name: "Shiso/Perilla, Green & Red", schedule: { March: "Indoor Start", April: "Transplant / Direct Sow", May: "Transplant / Direct Sow / Cuttings", June: "Direct Sow / Cuttings", July: "Direct Sow / Cuttings", August: "Cuttings", September: "Cuttings", February: "Indoor Start" } },
  { todo: false, name: "Snapdragon first lady", schedule: { March: "Direct Sow", September: "Direct Sow", October: "Direct Sow", January: "Indoor seed", February: "Indoor seed / direct sow" } },
  { todo: false, name: "Siberian Wallflower" },
  { todo: false, name: "Squash" },
  { todo: false, name: "Summer savory" },
  { todo: false, name: "Sweet alyssum" },
  { todo: false, name: "Sweet pea" },
  { todo: false, name: "Swiss chard" },
  { todo: false, name: "Tobacco flowering" },
  { todo: false, name: "Tomato", schedule: { January: "Indoor seed", February: "Indoor seed" } },
  { todo: false, name: "Tomatillo" },
  { todo: false, name: "Tulsi" },
  { todo: false, name: "Watermelon" },
  { todo: false, name: "Weed cuttings" },
  { todo: false, name: "Weed seeds" },
  { todo: false, name: "White Clover" },
  { todo: false, name: "Winter Squash", schedule: { April: "Direct Sow", May: "Direct Sow", June: "Direct Sow" } },
  { todo: false, name: "Yarrow" },
  { todo: false, name: "yellow summer squash" },
  { todo: true, name: "Zinnia", type: "Cut Flowers", schedule: { March: "Plug Tray Grow Tent" } },
  { todo: true, name: "Zinnia Thumbelina", type: "Cut Flowers", schedule: { March: "Indoor Start", April: "Direct Sow", May: "Direct Sow", June: "Direct Sow", July: "Direct Sow" } },
];

const initialFertilizers = ["FoxFarm Grow Big", "CalMag", "Overdrive", "Dr. Earth Fertilizer", "Worm Castings"];
const initialWishlist = ["Candy cane chocolate sweet pepper", "Black eyed susan vine", "Cilantro", "Basil"];

const profiles = {
  tomato: { ph: "6.2–6.8", description: "Warm-season fruiting plant that wants sun, airflow, and steady moisture.", fertilizer: "Use compost and worm castings at planting, then FoxFarm Grow Big or Dr. Earth during vegetative growth.", signs: "Feed when lower leaves pale, growth slows, or fruit set weakens." },
  pepper: { ph: "6.0–6.8", description: "Heat-loving fruiting plant that grows best when nights are mild and roots stay warm.", fertilizer: "Start with compost, then light FoxFarm Grow Big or Dr. Earth. Add CalMag in containers if needed.", signs: "Feed when foliage pales, plants stall, or fruiting slows." },
  basil: { ph: "6.0–7.5", description: "Fast warm-season herb that branches well when pinched and watered evenly.", fertilizer: "Use worm castings at planting and light feedings every 2–3 weeks in pots.", signs: "Feed when new growth is small, pale, or weak after cutting." },
  lettuce: { ph: "6.0–7.0", description: "Cool-season leafy crop with best flavor before heat arrives.", fertilizer: "Use compost before sowing and a light nitrogen feed after thinning.", signs: "Feed when leaves are pale, thin, or regrowth slows." },
  carrot: { ph: "6.0–6.8", description: "Root crop that prefers loose soil and even moisture without excess nitrogen.", fertilizer: "Use compost lightly before sowing; avoid heavy feeding.", signs: "Feed only if tops are pale and growth is weak." },
  arugula: { ph: "6.0–7.0", description: "Quick cool-season green that grows fast and turns stronger in flavor as weather warms.", fertilizer: "Mix in compost at planting and feed lightly after repeat cuts if needed.", signs: "Feed when regrowth is weak or leaves are pale." },
  pea: { ph: "6.0–7.5", description: "Cool-season climber that prefers mild weather and steady moisture.", fertilizer: "Usually compost is enough before sowing.", signs: "Feed only if pale and stunted in poor soil." },
  cucumber: { ph: "6.0–6.8", description: "Warm-season vine that likes sun, regular water, and quick harvests.", fertilizer: "Use compost at planting and balanced feed once vines begin running.", signs: "Feed when leaves pale or fruit stays short." },
  eggplant: { ph: "5.8–6.8", description: "Heat-loving nightshade that wants strong sun and even water.", fertilizer: "Compost at planting, then light feedings through early growth; CalMag can help in containers.", signs: "Feed when flowers drop or fruit stays small." },
  flower: { ph: "6.0–7.2", description: "Flowering annual or perennial that generally wants sun, airflow, and moderate fertility.", fertilizer: "Use compost at planting and light bloom support if container-grown.", signs: "Feed when plants are pale, stems weak, or bloom count drops." },
  herb: { ph: "6.0–7.5", description: "Herb profile for kitchen-garden crops that like sun and moderate feeding.", fertilizer: "Compost or worm castings first, then light feeding only when needed.", signs: "Feed when regrowth slows or leaves lose color." },
  default: { ph: "6.0–7.0", description: "General garden plant profile based on your crop list and planting schedule.", fertilizer: "Start with compost or worm castings, then use a light balanced feed only if growth stalls.", signs: "Watch for pale foliage, slow new growth, or weak flowering and fruiting before feeding." },
};

function getProfileKey(plant) {
  const n = (plant?.name || "").toLowerCase();
  const t = (plant?.type || "").toLowerCase();
  if (n.includes("tomatillo")) return "tomato";
  if (n.includes("tomato")) return "tomato";
  if (n.includes("pepper")) return "pepper";
  if (n.includes("basil") || n.includes("tulsi")) return "basil";
  if (n.includes("lettuce") || n.includes("bok choy")) return "lettuce";
  if (n.includes("carrot") || n.includes("radish")) return "carrot";
  if (n.includes("arugula")) return "arugula";
  if (n.includes("pea")) return "pea";
  if (n.includes("cucumber") || n.includes("melon") || n.includes("squash")) return "cucumber";
  if (n.includes("eggplant")) return "eggplant";
  if (t.includes("flower") || n.includes("zinnia") || n.includes("cosmos") || n.includes("dahlia")) return "flower";
  if (t.includes("herb") || n.includes("mint") || n.includes("parsley") || n.includes("oregano") || n.includes("sage")) return "herb";
  return "default";
}

function getPlantProfile(plant) {
  const key = getProfileKey(plant);
  const base = profiles[key] || profiles.default;
  return {
    ph: plant?.ph || base.ph,
    description: plant?.description || base.description,
    fertilizer: plant?.fertilizer || base.fertilizer,
    signs: plant?.signs || base.signs,
  };
}

function guessWatering(plant) {
  const n = (plant?.name || "").toLowerCase();
  if (n.includes("cacti")) return "Sparse watering";
  if (n.includes("lettuce") || n.includes("bok choy") || n.includes("arugula")) return "Consistent moisture";
  if (n.includes("carrot") || n.includes("radish")) return "Light + steady moisture";
  if (n.includes("tomato")) return "Deep watering 1–2x weekly";
  if (n.includes("pepper") || n.includes("eggplant")) return "Moderate, keep evenly moist";
  if (n.includes("basil") || n.includes("mint")) return "Do not let fully dry";
  return "Check soil moisture weekly";
}

function guessSun(plant) {
  const n = (plant?.name || "").toLowerCase();
  const t = (plant?.type || "").toLowerCase();
  if (n.includes("lettuce") || n.includes("bok choy") || n.includes("arugula")) return "Part sun to full sun";
  if (n.includes("cacti")) return "Bright sun";
  if (n.includes("tomato") || n.includes("pepper") || n.includes("corn") || n.includes("cucumber")) return "Full sun";
  if (t.includes("flower") || n.includes("zinnia") || n.includes("cosmos")) return "Full sun";
  if (t.includes("herb")) return "Full sun to part sun";
  return "Sun needs to confirm";
}

function guessStage(schedule, month) {
  const action = schedule?.[month];
  if (!action) return "No current task";
  if (/harvest/i.test(action)) return "Harvest window";
  if (/transplant/i.test(action)) return "Transplant time";
  if (/cuttings/i.test(action)) return "Cuttings";
  if (/indoor|starter|tray|tent|ziploc/i.test(action)) return "Indoor start";
  if (/direct sow|plant outdoors/i.test(action)) return "Direct sow";
  return action;
}

function timelineSummary(schedule) {
  if (!schedule) return "No schedule captured yet";
  return months.filter((m) => schedule[m]).map((m) => `${m.slice(0, 3)}: ${schedule[m]}`).join(" • ");
}

function getSanJoseWeatherNote(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("lettuce") || n.includes("arugula") || n.includes("cilantro") || n.includes("bok choy") || n.includes("pea")) {
    return "San Jose note: warming spring afternoons can push cool-season greens toward bolting, so harvest often and keep moisture steady.";
  }
  if (n.includes("tomato") || n.includes("pepper") || n.includes("eggplant") || n.includes("basil") || n.includes("cucumber") || n.includes("melon")) {
    return "San Jose note: mild spring warmth is good for hardening off and early growth, but avoid soggy roots around spring showers.";
  }
  return "San Jose note: mild spring weather supports establishment right now, but check the soil before watering during rainy stretches.";
}

function getSowingHowTo(plant, month) {
  const n = (plant?.name || "").toLowerCase();
  const action = plant?.schedule?.[month] || "";
  if (n.includes("carrot") || n.includes("radish")) return "Direct sow shallowly, about 1/4 inch deep, and keep the surface evenly moist until germination.";
  if (n.includes("lettuce") || n.includes("bok choy") || n.includes("arugula")) return "Direct sow shallowly or transplant starts, then keep moisture consistent and give some afternoon relief on warmer days.";
  if (n.includes("pea")) return "Direct sow about 1 inch deep and add support early so vines do not sprawl.";
  if (n.includes("corn")) return "Direct sow into warming ground and plant in blocks instead of one long row for better pollination later.";
  if (n.includes("basil") || n.includes("tulsi")) return "Start warm in trays or a protected spot with bright light, and do not keep the mix soggy.";
  if (n.includes("pepper") || n.includes("tomato") || n.includes("eggplant")) return "Start indoors with warmth and strong light, then harden off before transplanting outside.";
  if (n.includes("cucumber") || n.includes("squash") || n.includes("melon") || n.includes("cantaloupe")) return "Direct sow once soil is warm and draining well, because cold wet soil slows germination badly.";
  if (n.includes("zinnia") || n.includes("cosmos") || n.includes("sunflower") || n.includes("flower")) return "Direct sow in full sun, lightly cover, water gently, and thin seedlings for airflow.";
  if (/indoor|tray|tent|starter/i.test(action)) return "Start in trays with seed-starting mix, bright light, and steady warmth. Water lightly but consistently until roots fill the cell.";
  return "Sow in well-drained soil, keep moisture even during establishment, and avoid overwatering if rain is already in the forecast.";
}

function getMonthlyExpectation(month) {
  if (month === "April") {
    return [
      "Lettuce, arugula, and cilantro may begin bolting as warmer afternoons arrive. That is normal in San Jose spring, so harvest early and often.",
      "March sowings like carrots, peas, and greens should be actively growing now if moisture has stayed even.",
      "Indoor-started tomatoes, peppers, basil, and eggplant may look ready but can still pause after transplanting if nights stay cool. Harden them off gradually.",
      "With warming weather and some spring rain, overwatering is a bigger risk than underwatering for many established beds and containers.",
      "Bok choy, lettuce, and other fast greens may switch from leafy growth to stretching upward pretty quickly this month. That usually means heat and day length are taking over, not that you messed up.",
      "Peas sown in March may start flowering now, which is a good sign. Keep moisture even so flowers turn into pods instead of drying out.",
      "Any basil, tomatoes, or peppers you started indoors may look a little stalled outdoors at first. A short adjustment period after hardening off is normal before faster growth starts.",
      "Flowers sown in March like zinnias, cosmos, and some mixes may still look small in April. This is often root-building time before a bigger late-spring jump.",
      "If older lower leaves yellow on transplanted starts while new growth still looks healthy, that can be a normal transplant adjustment instead of a major nutrient issue.",
      "Container soil can swing from damp to dry faster than raised beds once sunny days stack up, so April is a good month to start checking pots daily.",
    ];
  }
  if (month === "May") {
    return [
      "Cool-season greens may fade faster in May heat, so replanting shifts toward warm crops and heat-tolerant herbs.",
      "Tomatoes, peppers, squash, cucumbers, and basil should be in active establishment mode if nights stay mild.",
      "Container plants will begin drying faster, so watering rhythm matters more than it did in early spring.",
    ];
  }
  return [
    "Plants started in earlier months may shift from leafy growth into flowering, fruiting, or seasonal slowdown depending on heat and day length.",
    "Use the current schedule and soil moisture together to decide whether changes are normal seasonal behavior or stress.",
  ];
}

export default function ClickGardenWebsite() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("April");
  const [selectedPlantName, setSelectedPlantName] = useState("Basil: Sweet italian large leaf");
  const [plantsData, setPlantsData] = useState(basePlants);
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [fertilizers] = useState(initialFertilizers);
  const [newPlantName, setNewPlantName] = useState("");
  const [newPlantType, setNewPlantType] = useState("Unsorted");
  const [newPlantMonthAction, setNewPlantMonthAction] = useState("");
  const [newWishlistItem, setNewWishlistItem] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.plantsData) setPlantsData(parsed.plantsData);
      if (parsed?.wishlist) setWishlist(parsed.wishlist);
    } catch (error) {
      console.error("Failed to load saved garden data", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ plantsData, wishlist }));
      setSaveMessage("Saved locally on this browser");
      const timer = setTimeout(() => setSaveMessage(""), 1500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Failed to save garden data", error);
      setSaveMessage("Save failed");
    }
  }, [plantsData, wishlist]);

  const addPlant = () => {
    const name = newPlantName.trim();
    if (!name) return;
    const nextPlant = {
      todo: false,
      name,
      ...(newPlantType && newPlantType !== "Unsorted" ? { type: newPlantType } : {}),
      ...(newPlantMonthAction.trim() ? { schedule: { [monthFilter]: newPlantMonthAction.trim() } } : {}),
    };
    setPlantsData((prev) => [nextPlant, ...prev]);
    setSelectedPlantName(name);
    setNewPlantName("");
    setNewPlantType("Unsorted");
    setNewPlantMonthAction("");
  };

  const addWishlistItem = () => {
    const item = newWishlistItem.trim();
    if (!item) return;
    setWishlist((prev) => [item, ...prev]);
    setNewWishlistItem("");
  };

  const updateSelectedPlant = (patch) => {
    setPlantsData((prev) => prev.map((plant) => plant.name === selectedPlantName ? { ...plant, ...patch } : plant));
  };

  const updateSelectedPlantSchedule = (value) => {
    setPlantsData((prev) => prev.map((plant) => {
      if (plant.name !== selectedPlantName) return plant;
      const nextSchedule = { ...(plant.schedule || {}) };
      if (value.trim()) nextSchedule[monthFilter] = value.trim();
      else delete nextSchedule[monthFilter];
      return { ...plant, schedule: Object.keys(nextSchedule).length ? nextSchedule : undefined };
    }));
  };

  const plantTypes = useMemo(() => ["All", ...Array.from(new Set(plantsData.map((p) => p.type).filter(Boolean))).sort()], [plantsData]);

  const filteredPlants = useMemo(() => {
    return plantsData.filter((plant) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || plant.name.toLowerCase().includes(q) || (plant.type || "").toLowerCase().includes(q) || (plant.schedule?.[monthFilter] || "").toLowerCase().includes(q);
      const matchesType = typeFilter === "All" || plant.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter, monthFilter, plantsData]);

  const selectedPlant = plantsData.find((p) => p.name === selectedPlantName) || filteredPlants[0] || plantsData[0];
  const selectedProfile = getPlantProfile(selectedPlant);

  const currentMonthPlants = useMemo(() => plantsData.filter((p) => p.schedule?.[monthFilter]), [plantsData, monthFilter]);
  const sowNowPlants = useMemo(() => currentMonthPlants.filter((p) => /direct sow|indoor|tray|tent|starter|ziploc/i.test(p.schedule?.[monthFilter] || "")), [currentMonthPlants, monthFilter]);
  const todoCount = plantsData.filter((p) => p.todo).length;
  const phCount = plantsData.filter((p) => p.ph).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0fdf4,_#ffffff_45%,_#f8fafc)] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-green-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              <Heart className="h-3.5 w-3.5" />
              Click Garden
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-green-900 sm:text-4xl">Shared garden dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">Built from your workbook with plant schedules, pH targets, watering guidance, fertilizer notes, editing tools, local saves, and a dynamic monthly breakdown for San Jose.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs text-slate-500">Share-ready</div>
              <div className="text-sm font-semibold text-slate-900">Publish to Vercel</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs text-slate-500">Save status</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Save className="h-4 w-4" />{saveMessage || "Auto-saving"}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { icon: Sprout, label: "Tracked plants", value: plantsData.length, note: "Imported from your planning sheets" },
            { icon: CalendarDays, label: `${monthFilter} actions`, value: currentMonthPlants.length, note: "Plants with a task this month" },
            { icon: FlaskConical, label: "Custom pH values", value: phCount, note: "Workbook + your overrides" },
            { icon: Package, label: "Fertilizers on hand", value: fertilizers.length, note: fertilizers.join(", ") },
            { icon: Heart, label: "Wishlist items", value: wishlist.length, note: wishlist.join(", ") },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-green-100 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                  <div className="mt-2 text-3xl font-bold text-green-900">{card.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{card.note}</div>
                </div>
                <card.icon className="h-5 w-5 text-green-700" />
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-green-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Quick edit tools</h2>
              <p className="mt-1 text-sm text-slate-500">Add new plants and wishlist seeds directly from the dashboard.</p>
              <div className="mt-4 rounded-3xl border border-slate-100 p-4">
                <div className="text-sm font-semibold text-slate-900">Add a plant</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <input value={newPlantName} onChange={(e) => setNewPlantName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="Plant name" />
                  <input value={newPlantType} onChange={(e) => setNewPlantType(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="Type" />
                  <input value={newPlantMonthAction} onChange={(e) => setNewPlantMonthAction(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder={`Action for ${monthFilter}`} />
                </div>
                <button onClick={addPlant} className="mt-3 w-full rounded-2xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 sm:w-auto">Add plant</button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Wishlist editor</h2>
              <p className="mt-1 text-sm text-slate-500">Track seeds and varieties you want to pick up next.</p>
              <div className="mt-4 rounded-3xl border border-slate-100 p-4">
                <div className="text-sm font-semibold text-slate-900">Add wishlist seed</div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input value={newWishlistItem} onChange={(e) => setNewWishlistItem(e.target.value)} className="w-full flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400" placeholder="Example: Lemon basil" />
                  <button onClick={addWishlistItem} className="w-full rounded-2xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 sm:w-auto">Add</button>
                </div>
                <div className="mt-3 text-xs text-slate-500">New entries appear instantly below in your seed wishlist section.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Plant library</h2>
                <p className="mt-1 text-sm text-slate-500">Search your plant list, filter by type, and see what each plant is doing in the selected month.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-400" placeholder="Search plant, type, or action" />
                </label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400">
                  {plantTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-400">
                  {months.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100">
              <div className="max-h-[620px] overflow-auto">
                <table className="min-w-[720px] text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Plant</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">pH</th>
                      <th className="px-4 py-3 font-medium">{monthFilter}</th>
                      <th className="px-4 py-3 font-medium">Watering</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlants.map((plant) => {
                      const active = plant.name === selectedPlant?.name;
                      return (
                        <tr key={plant.name} onClick={() => setSelectedPlantName(plant.name)} className={`cursor-pointer border-t border-slate-100 hover:bg-green-50/60 ${active ? "bg-green-50/70" : "bg-white"}`}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{plant.name}</div>
                            {plant.mixedSeeds ? <div className="mt-1 max-w-[320px] truncate text-xs text-slate-500">Mix: {plant.mixedSeeds}</div> : null}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{plant.type || "—"}</td>
                          <td className="px-4 py-3 font-medium text-green-800">{getPlantProfile(plant).ph}</td>
                          <td className="px-4 py-3 text-slate-600">{plant.schedule?.[monthFilter] || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{guessWatering(plant)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Plant profile</h2>
              <div className="mt-4 rounded-3xl bg-gradient-to-br from-green-100 to-lime-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-green-950">{selectedPlant.name}</h3>
                    <p className="mt-1 text-sm text-green-900">{selectedPlant.type || "Unsorted"} • {guessSun(selectedPlant)}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-800 shadow-sm">{guessStage(selectedPlant.schedule, monthFilter)}</span>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Target pH</div>
                    <input value={selectedProfile.ph} onChange={(e) => updateSelectedPlant({ ph: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-400" />
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Watering</div>
                    <div className="mt-2 font-medium text-slate-900">{guessWatering(selectedPlant)}</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Description</div>
                    <textarea value={selectedProfile.description} onChange={(e) => updateSelectedPlant({ description: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-400" />
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">When to fertilize</div>
                    <textarea value={selectedProfile.fertilizer} onChange={(e) => updateSelectedPlant({ fertilizer: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-400" />
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Signs it is time to feed</div>
                    <textarea value={selectedProfile.signs} onChange={(e) => updateSelectedPlant({ signs: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-400" />
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Action for {monthFilter}</div>
                    <input value={selectedPlant.schedule?.[monthFilter] || ""} onChange={(e) => updateSelectedPlantSchedule(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-400" placeholder={`Set action for ${monthFilter}`} />
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">San Jose note</div>
                    <div className="mt-1 text-sm leading-6 text-slate-700">{getSanJoseWeatherNote(selectedPlant.name)}</div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Full timeline</div>
                    <div className="mt-1 text-sm leading-6 text-slate-700">{timelineSummary(selectedPlant.schedule)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">What to do in {monthFilter}</h2>
              <div className="mt-4 max-h-[360px] space-y-3 overflow-auto pr-1">
                {currentMonthPlants.slice(0, 18).map((plant) => (
                  <div key={`${plant.name}-${monthFilter}`} className="rounded-2xl border border-slate-100 p-4">
                    <div className="font-medium text-slate-900">{plant.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{plant.type || "Unsorted"}</div>
                    <div className="mt-2 text-sm text-slate-700">{plant.schedule?.[monthFilter]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">{monthFilter} sowing guide</h2>
            <p className="mt-1 text-sm text-slate-500">A small list of what to sow now and how to sow it.</p>
            <div className="mt-4 space-y-3">
              {sowNowPlants.length ? sowNowPlants.slice(0, 10).map((plant) => (
                <div key={plant.name} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{plant.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{plant.schedule?.[monthFilter]}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-700">{getSowingHowTo(plant, monthFilter)}</div>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Sow now</span>
                  </div>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No sowing tasks are listed for {monthFilter} right now.</div>}
            </div>
          </div>

          <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">What to expect in {monthFilter}</h2>
            <p className="mt-1 text-sm text-slate-500">Normal changes from earlier plantings so the garden feels less mysterious.</p>
            <div className="mt-4 space-y-3">
              {getMonthlyExpectation(monthFilter).map((item, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-700" />
              <h2 className="text-2xl font-semibold text-slate-900">Fertilizers & supplies</h2>
            </div>
            <div className="mt-4 space-y-3">
              {fertilizers.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div>
                    <div className="font-medium text-slate-900">{item}</div>
                    <div className="text-sm text-slate-500">Current supply list</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">On hand</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-700" />
              <h2 className="text-2xl font-semibold text-slate-900">Seed wishlist</h2>
            </div>
            <div className="mt-4 space-y-3">
              {wishlist.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-medium text-slate-900">{item}</div>
                  <div className="mt-1 text-sm text-slate-500">Potential future addition</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-green-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Garden insights</h2>
              <p className="mt-1 text-sm text-slate-500">Quick takeaways synthesized from your current garden plan.</p>
            </div>
            <Sun className="h-5 w-5 text-green-700" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-green-50 p-5 text-sm leading-6 text-green-950">{monthFilter} currently shows {currentMonthPlants.length} scheduled plant actions, so it is a meaningful planning month in your system.</div>
            <div className="rounded-3xl bg-sky-50 p-5 text-sm leading-6 text-sky-950">Your list leans strongly into herbs, peppers, greens, and flowers, which fits a San Jose kitchen-garden plus pollinator-garden setup really well.</div>
            <div className="rounded-3xl bg-amber-50 p-5 text-sm leading-6 text-amber-950">Only a small portion of plants had workbook pH values, so matched guidance fills many of the blanks and makes the dashboard more useful.</div>
            <div className="rounded-3xl bg-rose-50 p-5 text-sm leading-6 text-rose-950">You currently have {todoCount} explicitly flagged to-do entries, so the dashboard still reflects your action list instead of only long-term planning.</div>
          </div>
        </section>
      </main>
    </div>
  );
}

