import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Volunteer from "@/lib/models/Volunteer";
import PartnerInquiry from "@/lib/models/PartnerInquiry";
import memoryStore from "@/lib/memoryStore";

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get("x-admin-key") || req.nextUrl.searchParams.get("key");
    const configuredKey = process.env.ADMIN_SECRET_KEY || "deeproots_admin_2026";

    if (!adminKey || adminKey !== configuredKey) {
      return NextResponse.json({ error: "Unauthorized access. Valid administrator key required." }, { status: 401 });
    }

    const db = await connectToDatabase();

    if (db) {
      const allDonations = await Donation.find().sort({ createdAt: -1 }).limit(100).lean();
      const volunteers = await Volunteer.find().sort({ createdAt: -1 }).limit(50).lean();
      const partners = await PartnerInquiry.find().sort({ createdAt: -1 }).limit(50).lean();

      const verified = allDonations.filter((d) => d.paymentStatus === "successful");
      const pendingTransfers = allDonations.filter((d) => d.paymentStatus === "awaiting_verification");
      const failed = allDonations.filter((d) => d.paymentStatus === "failed");

      const totalVerifiedAmount = verified.reduce((acc, d) => acc + d.amount, 0);

      return NextResponse.json({
        success: true,
        summary: {
          totalVerifiedAmount,
          verifiedDonationsCount: verified.length,
          pendingTransfersCount: pendingTransfers.length,
          failedPaymentsCount: failed.length,
          volunteersCount: volunteers.length,
          partnersCount: partners.length,
          databaseMode: "MongoDB Atlas (Live)",
        },
        donations: allDonations,
        volunteers,
        partners,
      });
    } else {
      const allDonations = memoryStore.getDonations();
      const verified = allDonations.filter((d) => d.paymentStatus === "successful");
      const pendingTransfers = allDonations.filter((d) => d.paymentStatus === "awaiting_verification");
      const failed = allDonations.filter((d) => d.paymentStatus === "failed");
      const totalVerifiedAmount = verified.reduce((acc, d) => acc + d.amount, 0);

      return NextResponse.json({
        success: true,
        summary: {
          totalVerifiedAmount,
          verifiedDonationsCount: verified.length,
          pendingTransfersCount: pendingTransfers.length,
          failedPaymentsCount: failed.length,
          volunteersCount: memoryStore.volunteers.length,
          partnersCount: memoryStore.partners.length,
          databaseMode: "In-Memory Sandbox (Local Development)",
        },
        donations: allDonations,
        volunteers: memoryStore.volunteers,
        partners: memoryStore.partners,
      });
    }
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Server error fetching administrative reports." }, { status: 500 });
  }
}
