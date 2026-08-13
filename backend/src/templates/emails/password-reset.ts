import { renderEmailLayout } from "./layout.js";
import { env } from "../../config/env.js";

export interface PasswordResetEmailData {
    name?: string;
    resetToken: string;
    resetUrl?: string;
    expiresInMinutes?: number;
}

export function getPasswordResetEmail(data: PasswordResetEmailData): string {
    const {
        name = "User",
        resetToken,
        resetUrl = `${env.FRONTEND_URL}/admin/reset-password?token=${encodeURIComponent(resetToken)}`,
        expiresInMinutes = 15,
    } = data;

    const contentHtml = `
    <!-- Header Title & Greeting -->
    <div style="text-align: left; margin-bottom: 24px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #1E293B; font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">
        Hello ${name},
      </h2>
      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        You are receiving this email because we received a password reset request for your account. Click the button below to reset it.
      </p>
      <p style="color: #1E293B; font-size: 13px; font-weight: 700; margin: 0;">
        ⏱️ This password reset link will expire in ${expiresInMinutes} minutes.
      </p>
    </div>

    <!-- Centered Dark Teal Action Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #164E50; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 10px rgba(22, 78, 80, 0.25);">
        Reset Password
      </a>
    </div>

    <!-- Notice Line -->
    <p style="color: #64748B; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">
      If you did not request a password reset, no further action is required.
    </p>

    <!-- Sign-off -->
    <div style="margin-bottom: 28px; color: #1E293B; font-size: 14px; font-weight: 600;">
      Regards,<br>
      <span style="color: #164E50;">Admin Portal Team</span>
    </div>

    <!-- Fallback Direct Link Section -->
    <div style="border-top: 1px dashed #E5E0D8; padding-top: 20px;">
      <p style="font-size: 12px; color: #64748B; margin: 0 0 8px 0;">
        If you're having trouble clicking the <strong>"Reset Password"</strong> button above, copy and paste the URL below into your web browser:
      </p>
      <p style="font-size: 11px; color: #164E50; word-break: break-all; margin: 0; font-family: monospace; background-color: #F8FAFC; padding: 10px; border-radius: 6px; border: 1px solid #E2E8F0;">
        ${resetUrl}
      </p>
    </div>
  `;

    return renderEmailLayout({
        title: "Password Reset Request",
        previewText: `Reset password link for your Admin Portal account. Valid for ${expiresInMinutes} minutes.`,
        contentHtml,
    });
}
