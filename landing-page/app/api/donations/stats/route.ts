import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const stats = await Donation.aggregate([
        { $match: { paymentStatus: "successful" } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      const totalVerifiedAmount = stats.length > 0 ? stats[0].totalAmount : 0;
      const verifiedCount = stats.length > 0 ? stats[0].count : 0;

      // Realistic baseline target for first 18 months
      return NextResponse.json({
        success: true,
        totalVerifiedAmount,
        verifiedDonationsCount: verifiedCount,
        targetPeopleGoal: 10000,
        targetPeriod: "First 18 Months",
      });
    } else {
      const stats = memoryStore.getStats();
      return NextResponse.json({
        success: true,
        totalVerifiedAmount: stats.totalVerifiedAmount,
        verifiedDonationsCount: stats.verifiedDonationsCount,
        targetPeopleGoal: 10000,
        targetPeriod: "First 18 Months",
      });
    }
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({
      success: false,
      totalVerifiedAmount: 0,
      verifiedDonationsCount: 0,
      targetPeopleGoal: 10000,
    });
  }
}
