import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Emails each issued certificate's Full Name + Certificate ID + download
 * link via nodemailer. Runs as a Next.js Route Handler (Node runtime) —
 * no separate backend to deploy or manage. SMTP credentials stay
 * server-side and are never bundled into client JS.
 *
 * Required environment variables (set in your host — e.g. Vercel → Project
 * → Settings → Environment Variables. NEVER prefix these with NEXT_PUBLIC_,
 * that would ship them in the public JS bundle):
 *
 *   SMTP_USER        — the sending mailbox address
 *   SMTP_PASS        — an app password (NOT your normal account password)
 *   SMTP_SERVICE      (optional) — e.g. "gmail" to use nodemailer's Gmail preset
 *   SMTP_HOST         (optional) — used instead of SMTP_SERVICE for other providers
 *   SMTP_PORT         (optional) — defaults to 465
 *   SMTP_FROM         (optional) — defaults to SMTP_USER
 *   ADMIN_API_KEY     (optional but recommended) — shared secret; if set, the
 *                      client must send it back as the "x-admin-key" header
 *                      (wired up client-side as NEXT_PUBLIC_CERT_MAIL_API_KEY)
 *   CORS_ORIGIN       (optional) — only needed if you call this route from a
 *                      different origin than this Next.js app itself
 *
 * Free option: a Gmail account with 2FA enabled + an "App Password" (Google
 * Account → Security → App passwords) works out of the box with
 * SMTP_SERVICE=gmail, free up to Gmail's own sending limits (~500/day).
 *
 * emailSubject / emailBody in the request body are the admin-authored
 * template from the "Email Template" tab in the admin dashboard. Both
 * support {{NAME}} and {{EVENT}} tokens, substituted per recipient here.
 */

// nodemailer needs Node APIs (net/tls) — this route can't run on the Edge runtime.
export const runtime = "nodejs";

interface CertificateInput {
    id?: string;
    name?: string;
    salutation?: string;
    email?: string;
    certificateId?: string;
}

interface RequestBody {
    certificates?: CertificateInput[];
    eventName?: string;
    origin?: string;
    downloadUrl?: string;
    emailSubject?: string;
    emailBody?: string;
}

function corsHeaders() {
    const allowedOrigin = process.env.CORS_ORIGIN || "*";
    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
    };
}

function buildTransporter() {
    const { SMTP_USER, SMTP_PASS, SMTP_SERVICE, SMTP_HOST, SMTP_PORT } =
        process.env;

    if (!SMTP_USER || !SMTP_PASS) {
        throw new Error(
            "Email is not configured. Set SMTP_USER and SMTP_PASS as environment variables (see src/app/api/send-certificate-emails/route.ts for details)."
        );
    }

    if (SMTP_SERVICE) {
        return nodemailer.createTransport({
            service: SMTP_SERVICE,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
    }

    const port = Number(SMTP_PORT) || 465;
    return nodemailer.createTransport({
        host: SMTP_HOST || "smtp.gmail.com",
        port,
        secure: port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
}

function escapeHtml(value: unknown): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };
    return String(value ?? "").replace(/[&<>"']/g, (c) => map[c]);
}

/** Replaces {{NAME}} / {{EVENT}} tokens in admin-authored plain text. */
function substituteTokens(
    template: string,
    { name, eventName }: { name: string; eventName?: string }
): string {
    return String(template ?? "")
        .replaceAll("{{NAME}}", name)
        .replaceAll("{{EVENT}}", eventName ?? "");
}

/** Plain text (with \n line breaks) -> safe HTML paragraphs. */
function textToHtml(text: string): string {
    return String(text ?? "")
        .split(/\n{2,}/)
        .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
        .join("");
}

const DEFAULT_SUBJECT = "Your certificate for {{EVENT}} is ready";
const DEFAULT_BODY =
    "Hi {{NAME}},\n\nYour certificate for {{EVENT}} has been issued. Use the details below to download it any time.";

function certificateEmailHtml({
    introHtml,
    displayName,
    certificateId,
    downloadUrl,
    verifyUrl,
}: {
    introHtml: string;
    displayName: string;
    certificateId: string;
    downloadUrl: string;
    verifyUrl: string;
}) {
    return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      ${introHtml}
      <table style="margin: 16px 0; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #666;">Full Name</td>
          <td><strong>${escapeHtml(displayName)}</strong></td>
        </tr>
        <tr>
          <td style="padding: 4px 12px 4px 0; color: #666;">Certificate ID</td>
          <td><strong>${escapeHtml(certificateId)}</strong></td>
        </tr>
      </table>
      <p style="font-size: 12px; color: #888;">
        Enter the Full Name and Certificate ID exactly as shown above on the
        download page — they must match your issued certificate exactly.
      </p>
      <p>
        <a href="${downloadUrl}" style="display:inline-block;background:#6d28d9;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:600;">
          Download Certificate
        </a>
      </p>
      <p style="font-size: 12px; color: #888; margin-top: 20px;">
        Anyone can verify this certificate's authenticity at
        <a href="${verifyUrl}">${verifyUrl}</a>.
      </p>
    </div>
  `;
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
    const headers = corsHeaders();

    // Optional shared-secret check — set ADMIN_API_KEY on the server and
    // NEXT_PUBLIC_CERT_MAIL_API_KEY (same value) on the client to enable this.
    const adminKey = process.env.ADMIN_API_KEY;
    if (adminKey && req.headers.get("x-admin-key") !== adminKey) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401, headers }
        );
    }

    let body: RequestBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400, headers }
        );
    }

    const { certificates, eventName, origin, downloadUrl, emailSubject, emailBody } =
        body;

    if (!Array.isArray(certificates) || certificates.length === 0) {
        return NextResponse.json(
            { error: "certificates[] is required" },
            { status: 400, headers }
        );
    }
    if (!origin || !downloadUrl) {
        return NextResponse.json(
            { error: "origin and downloadUrl are required" },
            { status: 400, headers }
        );
    }

    let transporter;
    try {
        transporter = buildTransporter();
    } catch (err) {
        const message = err instanceof Error ? err.message : "Email is not configured.";
        return NextResponse.json({ error: message }, { status: 500, headers });
    }

    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
    const subjectTemplate = emailSubject || DEFAULT_SUBJECT;
    const bodyTemplate = emailBody || DEFAULT_BODY;

    let sent = 0;
    let failed = 0;

    for (const cert of certificates) {
        if (!cert.email || !cert.certificateId || !cert.name) {
            failed += 1;
            continue;
        }

        // BUG FIX: the previous version used the salutation-prefixed name (e.g.
        // "Mr. John Doe") for BOTH the greeting AND the "Full Name" field shown
        // in the email table — but certificate lookup/download matches against
        // the exact stored name ("John Doe", no salutation). Recipients who
        // copy-pasted the name straight from the email therefore always got a
        // "certificate not found" error. Fix: only use the salutation for the
        // greeting; the table (and any future exact-match use) shows the raw,
        // exact stored name.
        const displayName = cert.name;
        const greetingName = cert.salutation
            ? `${cert.salutation} ${cert.name}`
            : cert.name;

        const verifyUrl = `${origin}/verify?id=${encodeURIComponent(cert.certificateId)}`;

        const subject = substituteTokens(subjectTemplate, {
            name: greetingName,
            eventName,
        });
        const introHtml = textToHtml(
            substituteTokens(bodyTemplate, { name: greetingName, eventName })
        );

        try {
            await transporter.sendMail({
                from: fromAddress,
                to: cert.email,
                subject,
                html: certificateEmailHtml({
                    introHtml,
                    displayName,
                    certificateId: cert.certificateId,
                    downloadUrl,
                    verifyUrl,
                }),
            });
            sent += 1;
        } catch (err) {
            console.error(
                `Failed to email ${cert.email}:`,
                err instanceof Error ? err.message : err
            );
            failed += 1;
        }
    }

    return NextResponse.json({ sent, failed }, { status: 200, headers });
}