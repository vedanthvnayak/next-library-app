import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const botResponse =
      response.choices[0]?.message?.content?.trim() ||
      "Sorry, no response from the bot.";

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ response: "Sorry, something went wrong." });
  }
}
