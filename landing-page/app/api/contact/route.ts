import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many messages. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const db = await connectToDatabase();
    if (db) {
      await ContactMessage.create({
        ...data,
        ipAddress: ip,
      });
    } else {
      memoryStore.addContact({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received. Our team will get back to you shortly.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Server error sending message." }, { status: 500 });
  }
}
