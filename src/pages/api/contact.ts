import type { APIRoute } from "astro";
import { GAS_URL, ALLOWED_ORIGINS } from "../../lib/env";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().default(""),
  message: z.string().min(5).max(2000),
});

export const POST: APIRoute = async ({ request, url, clientAddress }) => {
  // Log headers properly
  const headersObj: Record<string, string> = {};
  request.headers.forEach((v, k) => (headersObj[k] = v));
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(
      JSON.stringify({ ok: false, error: "Origin not allowed" }),
      { status: 403 }
    );
  }

  let payload: any;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const rawText = await request.text();
      payload = JSON.parse(rawText);
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid JSON" }),
        { status: 400 }
      );
    }
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries());
  } else {
    return new Response(
      JSON.stringify({ ok: false, error: "Unsupported Content-Type" }),
      { status: 415 }
    );
  }

  // --- Validate ---
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ ok: false, error: parsed.error.flatten() }),
      { status: 400 }
    );
  }

  // --- Forward tới Google Apps Script ---
  const body = new URLSearchParams({
    ...parsed.data,
    origin,
    userAgent: request.headers.get("user-agent") || "",
  });

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = await res
      .json()
      .catch(() => ({ ok: false, error: "Bad GAS response" }));
    if (!json.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: json.error || "GAS error" }),
        { status: 500 }
      );
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || "Proxy error" }),
      { status: 500 }
    );
  }
};
