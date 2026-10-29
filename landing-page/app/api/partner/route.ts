import { NextRequest, NextResponse } from "next/server";
import { PartnerSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import PartnerInquiry from "@/lib/models/PartnerInquiry";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = PartnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const db = await connectToDatabase();
    if (db) {
      await PartnerInquiry.create(data);
    } else {
      memoryStore.addPartner({
        organizationName: data.organizationName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        partnershipType: data.partnershipType,
        message: data.message,
        status: "new",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. Our partnerships team will review your proposal and contact you promptly.",
    });
  } catch (error) {
    console.error("Partner submission error:", error);
    return NextResponse.json({ error: "Server error processing partner request." }, { status: 500 });
  }
}
