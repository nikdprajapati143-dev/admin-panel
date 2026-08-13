import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, "error.log");
const appLogPath = path.join(logDir, "app.log");

function redactSensitiveData(data: any): any {
    if (typeof data !== "object" || data === null) return data;

    if (Array.isArray(data)) {
        return data.map(redactSensitiveData);
    }

    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ["password", "confirmPassword", "token", "accessToken", "refreshToken", "resetToken", "secret", "SMTP_PASS"];

    for (const [key, value] of Object.entries(data)) {
        if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
            sanitized[key] = "[REDACTED]";
        } else if (typeof value === "object" && value !== null) {
            sanitized[key] = redactSensitiveData(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

export function logError(title: string, details?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [ERROR] ${title}\n`;

    if (details !== undefined) {
        const sanitized = redactSensitiveData(details);
        if (typeof sanitized === "object") {
            logMessage += `Details: ${JSON.stringify(sanitized, null, 2)}\n`;
        } else {
            logMessage += `Details: ${sanitized}\n`;
        }
    }
    logMessage += `--------------------------------------------------\n`;

    // Console output in dev
    console.error(logMessage);

    // Write to error.log and app.log
    fs.appendFileSync(errorLogPath, logMessage, "utf-8");
    fs.appendFileSync(appLogPath, logMessage, "utf-8");
}

export function logInfo(message: string, details?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [INFO] ${message}\n`;

    if (details !== undefined) {
        const sanitized = redactSensitiveData(details);
        if (typeof sanitized === "object") {
            logMessage += `Details: ${JSON.stringify(sanitized, null, 2)}\n`;
        } else {
            logMessage += `Details: ${sanitized}\n`;
        }
    }
    logMessage += `--------------------------------------------------\n`;

    console.log(logMessage);

    // Write to app.log
    fs.appendFileSync(appLogPath, logMessage, "utf-8");
}
