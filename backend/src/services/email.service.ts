import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logError, logInfo } from "../utils/logger.js";
import {
    getAdminCreatedEmail,
    AdminCreatedEmailData,
} from "../templates/emails/admin-created.js";
import {
    getCustomerCreatedEmail,
    CustomerCreatedEmailData,
} from "../templates/emails/customer-created.js";
import {
    getPasswordResetEmail,
    PasswordResetEmailData,
} from "../templates/emails/password-reset.js";

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: env.SMTP_HOST,
                port: env.SMTP_PORT,
                secure: env.SMTP_PORT === 465, // true for 465, false for other ports
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false, // Prevents self-signed certificate errors
                },
            });
        } else {
            logError("EmailService Initialized without SMTP configuration. Emails will not be delivered.");
        }
    }

    private async sendMail(to: string, subject: string, html: string): Promise<boolean> {
        const fromName = env.SMTP_FROM_NAME || "Admin Panel Support";
        const fromEmail = env.SMTP_FROM_EMAIL || env.SMTP_USER || "noreply@adminpanel.com";
        const from = `"${fromName}" <${fromEmail}>`;

        if (!this.transporter) {
            logError(`Failed to send email to ${to}: SMTP Transporter is not configured in .env`, {
                to,
                subject,
                smtpUser: env.SMTP_USER ? "Provided" : "Missing",
            });
            return false;
        }

        try {
            const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                html,
            });

            logInfo(`Email delivered successfully to ${to} (MessageID: ${info.messageId})`, {
                to,
                subject,
                response: info.response,
            });
            return true;
        } catch (error: any) {
            logError(`Failed to deliver email to ${to}`, {
                to,
                subject,
                error: error.message || error,
                stack: error.stack,
            });
            return false;
        }
    }

    async sendAdminCreatedEmail(data: AdminCreatedEmailData): Promise<boolean> {
        const html = getAdminCreatedEmail(data);
        const subject = "Welcome to Admin Portal - Your Account Credentials";
        return await this.sendMail(data.email, subject, html);
    }

    async sendCustomerCreatedEmail(data: CustomerCreatedEmailData): Promise<boolean> {
        const html = getCustomerCreatedEmail(data);
        const subject = "Welcome to Customer Portal - Registration Successful";
        return await this.sendMail(data.email, subject, html);
    }

    async sendPasswordResetEmail(data: PasswordResetEmailData & { email: string }): Promise<boolean> {
        const html = getPasswordResetEmail(data);
        const subject = "Password Reset Request - Admin Portal";
        return await this.sendMail(data.email, subject, html);
    }
}
