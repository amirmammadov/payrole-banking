import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Card from "@/lib/models/card.model";
import Transactions from "@/lib/models/transactions.model";

export async function POST(request: NextRequest) {
  connectToDB();

  const reqBody = await request.json();

  const userID = reqBody.userID;
  const cardNumber = reqBody.cardNumber;
  const amount = reqBody.amount;

  if (!userID && !cardNumber && !(amount > 0)) {
    return NextResponse.json(
      { message: "Invalid card value or amount!" },
      { status: 400 },
    );
  }

  try {
    const user = await User.findById(userID);

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }

    const senderCard = await Card.find({ userID });
    const receiverCard = await Card.find({ cardNumber });

    if (!senderCard && !receiverCard) {
      return NextResponse.json({ message: "Card not found!" }, { status: 400 });
    }

    senderCard[0].balance = senderCard[0].balance - parseFloat(amount);
    receiverCard[0].balance = receiverCard[0].balance + parseFloat(amount);

    //transactions
    const receiverUserID = await receiverCard[0].userID;

    const { firstName, lastName, job } = await User.findById(
      receiverUserID,
    ).populate("firstName lastName job");

    const newTransaction = new Transactions({
      senderId: userID,
      receiverId: receiverUserID,
      receiverName: firstName,
      receiverSurname: lastName,
      receiverJob: job,
      amount,
    });

    await senderCard[0].save();
    await receiverCard[0].save();
    await newTransaction.save();

    return NextResponse.json({
      message: "Insurance created successfully",
      success: true,
      data: senderCard,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}