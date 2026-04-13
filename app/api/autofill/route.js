import OpenAI from "openai";

export async function POST(req) {
  try {
    const { plantName } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a gardening expert. Always return valid JSON only. No explanations.",
        },
        {
          role: "user",
          content: `
Give structured plant data for "${plantName}" in JSON format with:

type: string
ph: string (range)
description: short paragraph
fertilizer: short guidance
signs: when to fertilize
schedule: object of months (April, May, etc) → action

Example:
{
  "type": "Vegetable",
  "ph": "6.0-6.8",
  "description": "...",
  "fertilizer": "...",
  "signs": "...",
  "schedule": {
    "April": "Indoor start",
    "May": "Transplant outdoors"
  }
}
`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    return Response.json(JSON.parse(text));
  } catch (err) {
    console.error("AUTO FILL ERROR:", err);
    return Response.json({ error: "Failed to autofill" }, { status: 500 });
  }
}