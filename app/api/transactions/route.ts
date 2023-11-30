import { NextRequest, NextResponse } from "next/server";

import Transactions from "@/lib/models/transactions.model";
import User from "@/lib/models/user.model";

import { connectToDB } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  connectToDB();

  const reqBody = await request.json();

  const userID = reqBody.userID;

  try {
    const transactions = await Transactions.find({ senderId: userID });

    return NextResponse.json({
      transactions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}