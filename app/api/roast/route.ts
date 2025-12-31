import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

const SYSTEM_PROMPT = `You are the "Desi Executioner" - a brutal, sarcastic, no-nonsense critic who roasts New Year resolutions. 

Your style:
- Use primarily English with occasional Hinglish phrases for flavor (like "Beta", "Bhai", "Arre wah" - but sparingly)
- Be brutally honest, sarcastic, and reality-checking
- Point out hypocrisy, unrealistic goals, and past failures
- Keep it sharp, witty, and direct - no sugar-coating
- Length: 2 sentences or less than 100 characters, punchy and impactful
- Make it personal and relatable, with Indian cultural references when relevant (but mostly in English)

Examples of your style:
- "Arre wah! 1st January ko gym, 2nd ko body ache, aur 3rd ko wapis bhature-chole? Your motivation has a shorter lifespan than a Snapchat story."
- "5 AM? Beta, you can't even turn off your 10 AM alarm. Your 'meditation' is just deep sleep in a sitting position. Just stay in bed and stop lying to yourself."
- "Bank balance dekha hai? Europe choro, you'll be borrowing from friends even for a Lonavala trip. Dreaming in Dollars on a Rupee salary is your favorite hobby."

Now roast the given resolution in this exact style - mostly English with occasional Hinglish phrases.`;

export async function POST(req: Request) {
  const { resolution } = await req.json();

  if (!resolution || typeof resolution !== "string") {
    return NextResponse.json(
      { error: "Resolution is required" },
      { status: 400 }
    );
  }

  // Security: Character length validation
  if (resolution.length > 200) {
    return NextResponse.json(
      { error: "Resolution must be 200 characters or less" },
      { status: 400 }
    );
  }

  // Security: Basic sanitization - remove potentially dangerous characters
  // Remove null bytes, control characters, and common injection patterns
  const sanitized = resolution
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();

  if (sanitized.length === 0) {
    return NextResponse.json(
      { error: "Invalid resolution text" },
      { status: 400 }
    );
  }

  // Additional check: prevent common injection patterns
  // Only block SQL keywords and shell command patterns, not normal punctuation
  const dangerousPatterns = [
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT|JAVASCRIPT|ONLOAD|ONERROR|SH|BASH|CMD|POWERSHELL)\b/i,
    /[;&|`$]/g, // Block semicolons, ampersands, pipes, backticks, and dollar signs (common in injections)
    /(\/\*|\*\/|--\s)/, // SQL comment patterns
    /<script|javascript:|onerror=|onload=/i, // XSS patterns
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return NextResponse.json(
        { error: "Invalid characters detected in resolution" },
        { status: 400 }
      );
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Critique this New Year resolution: "${sanitized}"`,
        },
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    const verdict = completion.choices[0]?.message?.content?.trim() || "";

    if (!verdict) {
      throw new Error("No response from OpenAI");
    }

    return NextResponse.json({ verdict });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      {
        error:
          error.message || "Failed to generate roast. Try again in a moment.",
      },
      { status: 500 }
    );
  }
}