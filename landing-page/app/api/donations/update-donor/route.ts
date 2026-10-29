import { NextRequest, NextResponse } from "next/server";
import { UpdateDonorDetailsSchema } from "@/lib/validation";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateDonorDetailsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid donor details", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { internalId, donorName, donorEmail, donorPhone, isTaxReceiptRequested } = parsed.data;

    const db = await connectToDatabase();
    let updated = null;

    if (db) {
      updated = await Donation.findOneAndUpdate(
        { internalId },
        {
          donorName,
          donorEmail,
          donorPhone,
          isTaxReceiptRequested,
        },
        { new: true }
      );
    } else {
      updated = memoryStore.updateDonorDetails(internalId, {
        donorName,
        donorEmail,
        donorPhone,
        isTaxReceiptRequested,
      });
    }

    if (!updated) {
      return NextResponse.json({ error: "Donation record not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      internalId,
      donorName: updated.donorName,
      donorEmail: updated.donorEmail,
      message: "Donor details updated successfully.",
    });
  } catch (err) {
    console.error("Error in update-donor:", err);
    return NextResponse.json({ error: "Failed to update donor details." }, { status: 500 });
  }
}
