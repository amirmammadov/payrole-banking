import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";

import { OpenAI } from "openai";

export async function POST(request: NextRequest) {
  connectToDB();

  try {
    const reqBody = await request.json();

    const input = reqBody.inputValue;

    console.log(input);

    const openai = new OpenAI({ apiKey: process.env.CHAT_KEY });

    console.log(openai);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    });

    console.log(response);

    return NextResponse.json({ answer: response.choices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
