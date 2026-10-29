import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_SECRET_KEY || "deeproots_admin_2026";

    if (!adminKey || adminKey !== configuredKey) {
      return NextResponse.json({ error: "Unauthorized access. Valid administrator key required." }, { status: 401 });
    }

    const { internalId, verifiedBy } = await req.json();
    if (!internalId) {
      return NextResponse.json({ error: "Donation internalId is required." }, { status: 400 });
    }

    const author = verifiedBy || "DeepRoots Accounts Officer";
    const db = await connectToDatabase();

    if (db) {
      const updated = await Donation.findOneAndUpdate(
        { internalId },
        {
          paymentStatus: "successful",
          verifiedAt: new Date(),
          verifiedBy: author,
        },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ error: "Donation record not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Donation ${internalId} marked as successfully verified by ${author}.`,
        donation: updated,
      });
    } else {
      const updated = memoryStore.verifyDonation(internalId, author);
      if (!updated) {
        return NextResponse.json({ error: "Donation record not found in memory store" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Donation ${internalId} marked as successfully verified by ${author}.`,
        donation: updated,
      });
    }
  } catch (error) {
    console.error("Transfer verification error:", error);
    return NextResponse.json({ error: "Server error verifying transfer." }, { status: 500 });
  }
}
