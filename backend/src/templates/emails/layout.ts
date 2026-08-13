export interface EmailLayoutOptions {
    title?: string;
    previewText?: string;
    contentHtml: string;
}

export function renderEmailLayout(options: EmailLayoutOptions): string {
    const { title = "Admin Portal", previewText = "", contentHtml } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4F6F8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body bgcolor="#F4F6F8" style="margin:0; padding:0; background-color:#F4F6F8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}

  <table width="100%" cellPadding="0" cellSpacing="0" border="0" bgcolor="#F4F6F8" style="background-color:#F4F6F8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" cellPadding="0" cellSpacing="0" border="0" bgcolor="#ffffff" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #E5E0D8;">
          
          <!-- Top Header Bar with Centered Logo (Matching Screenshot 2) -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background-color: #ffffff !important; padding: 30px 20px 24px 20px; text-align: center; border-bottom: 1px solid #E5E0D8;">
              <table cellPadding="0" cellSpacing="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="font-size: 24px; color: #164E50; font-weight: bold; padding-right: 8px; vertical-align: middle;">❖</td>
                  <td style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 800; color: #164E50; letter-spacing: 1.5px; text-transform: uppercase; vertical-align: middle;">
                    ADMIN PORTAL
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff !important; padding: 32px 36px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Solid Dark Teal Footer Bar (Matching Screenshot 2 Bottom Red Box) -->
          <tr>
            <td align="center" bgcolor="#164E50" style="background-color: #164E50 !important; padding: 22px 20px; text-align: center; color: #ffffff !important; font-size: 13px; font-weight: 700; border-top: 1px solid #113E40;">
              <span style="color: #ffffff !important; font-family: sans-serif;">2026 &copy; <strong style="color: #ffffff !important;">ADMIN PORTAL</strong>. All rights reserved.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
