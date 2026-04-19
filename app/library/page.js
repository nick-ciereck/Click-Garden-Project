
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PlantLibrary() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    async function fetchPlants() {
      const { data, error } = await supabase
        .from("plants")
        .select("*");

      if (error) {
        console.log("LIBRARY FETCH ERROR:", error);
      } else {
        setPlants(data);
      }
    }

    fetchPlants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🌱 Plant Library</h1>

      <div className="grid gap-4">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="border p-4 rounded bg-white shadow-sm"
          >
            <h2 className="text-lg font-semibold">{plant.name}</h2>
            <p className="text-sm text-gray-600">{plant.type}</p>
            <p className="text-sm mt-2">{plant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
