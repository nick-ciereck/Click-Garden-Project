export async function POST(req) {
  try {
    const { plantName } = await req.json();

    if (!plantName) {
      return Response.json({ error: "No plant name provided" }, { status: 400 });
    }

    const API_KEY = process.env.PERENUAL_API_KEY;

    // 🔍 DEBUG LOG 1
    console.log("API KEY:", API_KEY);

    if (!API_KEY) {
      return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    const res = await fetch(
      `https://perenual.com/api/species-list?key=${API_KEY}&q=${plantName}`
    );

    // 🔍 DEBUG LOG 2
    console.log("STATUS:", res.status);

    const json = await res.json();

    // 🔍 DEBUG LOG 3
    console.log("RAW RESPONSE:", JSON.stringify(json, null, 2));

    if (!json.data || json.data.length === 0) {
      return Response.json({ error: "No plant found" });
    }

    const plant = json.data.find(p =>
  p.common_name?.toLowerCase().includes(plantName.toLowerCase())
) || json.data[0];

    const result = {
	  name: plant.common_name || plantName,
	  type: plant.cycle || "Plant",

	  description: plant.description || "",

	  ph: "6.0–7.0", // still fallback

	  fertilizer: plant.growth_rate
		? `Growth rate: ${plant.growth_rate}. Feed accordingly.`
		: "General fertilizer during growing season",

	  signs: plant.watering
		? `Watering needs: ${plant.watering}`
		: "Monitor plant health",

	  schedule: {
		[plant.pruning_month?.[0] || "April"]: "Care / maintenance"
	  },

	  // 🔥 NEW DATA YOU CAN USE LATER
	  //sunlight: plant.sunlight || [],
	  //watering: plant.watering || "",
	  //growth_rate: plant.growth_rate || "",
	  //hardiness: plant.hardiness || {},
	};

    return Response.json(result);

  } catch (err) {
    console.error("PERENUAL ERROR:", err);
    return Response.json({ error: "Failed to fetch plant data" }, { status: 500 });
  }
}