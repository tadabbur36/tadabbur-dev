import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json(
        { activated: false, error: "License key required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;

    if (!apiKey || apiKey.startsWith("placeholder")) {
      return NextResponse.json(
        { activated: false, error: "Server not configured yet" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/activate",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          license_key: licenseKey.trim(),
          instance_name: "Tadabbur Web",
        }),
      }
    );

    const data = await res.json();

    if (data.activated) {
      return NextResponse.json({
        activated: true,
        licenseKey: licenseKey.trim(),
      });
    }

    return NextResponse.json({
      activated: false,
      error: data.error || "Invalid license key",
    });
  } catch (err) {
    console.error("Activation error:", err);
    return NextResponse.json(
      { activated: false, error: "Server error" },
      { status: 500 }
    );
  }
}