import { NextRequest, NextResponse } from "next/server";
import { VolunteerSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import Volunteer from "@/lib/models/Volunteer";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = VolunteerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const db = await connectToDatabase();
    if (db) {
      await Volunteer.create(data);
    } else {
      memoryStore.addVolunteer({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        interest: data.interest,
        availability: data.availability,
        message: data.message,
        status: "new",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for volunteering with DeepRoots Foundation. Our field coordinator in Vidarbha will reach out to you shortly.",
    });
  } catch (error) {
    console.error("Volunteer submission error:", error);
    return NextResponse.json({ error: "Server error processing application." }, { status: 500 });
  }
}
