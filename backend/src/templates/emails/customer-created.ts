import { renderEmailLayout } from "./layout.js";

export interface CustomerCreatedEmailData {
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  loginUrl?: string;
}

export function getCustomerCreatedEmail(data: CustomerCreatedEmailData): string {
  const {
    name,
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
      <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin: 0; max-width: 480px; margin: 0 auto;">
        Your customer account has been successfully created! We are thrilled to have you with us. You can now access your account portal and explore all our available features and services.
      </p>
    </div>

    <!-- Dark Teal CTA Button -->
      <!--<div style="text-align: center; margin: 32px 0;">
      <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #164E50; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 10px rgba(22, 78, 80, 0.25);">
        Access Customer Portal &rarr;
      </a>
    </div> -->

    <div style="border-top: 1px solid #E5E0D8; padding-top: 20px; text-align: center;">
      <p style="font-size: 12px; color: #64748B; margin: 0 0 6px 0;">
        Need help getting started? Contact our support team:
      </p>
      <p style="font-size: 12px; font-weight: 700; color: #164E50; margin: 0 0 12px 0;">
        📧 support@example.com | 📞 +1 (555) 123-4567
      </p>
      <p style="font-size: 11px; color: #94A3B8; margin: 0;">
        If you did not create this account, please contact our customer support team immediately.
      </p>
    </div>
  `;

  return renderEmailLayout({
    title: "Welcome to Customer Portal",
    previewText: `Welcome ${name}! Your customer account is ready.`,
    contentHtml,
  });
}
