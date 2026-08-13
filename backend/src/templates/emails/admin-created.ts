import { renderEmailLayout } from "./layout.js";

export interface AdminCreatedEmailData {
    name: string;
    email: string;
    role: string;
    temporaryPassword?: string;
    loginUrl?: string;
}

export function getAdminCreatedEmail(data: AdminCreatedEmailData): string {
    const {
        name,
        email,
        temporaryPassword = "GeneratedAtCreation",
        loginUrl = "http://localhost:5173/admin/login",
    } = data;

    const contentHtml = `
    <!-- Header Greeting -->
    <div style="text-align: center; margin-bottom: 28px;">
      <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #1E293B; font-size: 26px; font-weight: 700; margin: 0 0 8px 0;">
        Welcome to Our Platform!
      </h2>
      <p style="color: #475569; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">
        Hello ${name},
      </p>
      <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0; max-width: 480px; margin: 0 auto;">
        Your business administrator account has been successfully created! We're excited to have you on board. You can now access your dashboard and start managing your business.
      </p>
    </div>

    <!-- Login Credentials Box (Matching Screenshot 3) -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: left;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748B; font-weight: 700; text-align: center; margin-bottom: 20px;">
        YOUR LOGIN CREDENTIALS
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 11px; color: #64748B; font-weight: 600; margin-bottom: 4px;">Email Address</div>
        <div style="font-size: 14px; font-weight: 700; color: #164E50; word-break: break-all; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
          ${email}
        </div>
      </div>

      <div>
        <div style="font-size: 11px; color: #64748B; font-weight: 600; margin-bottom: 4px;">Temporary Password</div>
        <div style="font-size: 15px; font-family: monospace; font-weight: 700; color: #1E293B;">
          ${temporaryPassword}
        </div>
      </div>
    </div>

    <!-- Yellow Security Reminder Banner (Matching Screenshot 3) -->
    <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 12px 16px; margin-bottom: 28px; text-align: left;">
      <p style="font-size: 12px; color: #92400E; margin: 0; font-weight: 600;">
        🔒 <strong>Security Reminder:</strong> For your security, please change your password after your first login.
      </p>
    </div>

    <!-- Dark Teal CTA Button (Matching Screenshot 3) -->
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #164E50; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 10px rgba(22, 78, 80, 0.25);">
        Login to Your Dashboard &rarr;
      </a>
    </div>

    <div style="border-top: 1px solid #E5E0D8; padding-top: 20px; text-align: center;">
      <p style="font-size: 12px; color: #64748B; margin: 0 0 6px 0;">
        Need help getting started? Contact our support team:
      </p>
      <p style="font-size: 12px; font-weight: 700; color: #164E50; margin: 0 0 12px 0;">
        📧 support@example.com | 📞 +1 (555) 123-4567
      </p>
      <p style="font-size: 11px; color: #94A3B8; margin: 0;">
        If you did not request this account or have any questions, please contact our support team immediately.
      </p>
    </div>
  `;

    return renderEmailLayout({
        title: "Welcome Administrator",
        previewText: `Welcome ${name}! Your administrator account is ready.`,
        contentHtml,
    });
}
