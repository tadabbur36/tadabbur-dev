import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json(
        { valid: false, error: "License key required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!apiKey || apiKey.startsWith("placeholder")) {
      return NextResponse.json(
        { valid: false, error: "Server not configured yet" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/validate",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          license_key: licenseKey.trim(),
        }),
      }
    );

    const data = await res.json();

    if (data.valid) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false });
  } catch (err) {
    console.error("Validation error:", err);
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500 }
    );
  }
}