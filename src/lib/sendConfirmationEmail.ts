import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You applied — Gili Creator Week 🌴</title>
</head>
<body style="margin:0;padding:0;background-color:#EBE7E0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EBE7E0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:6px;text-transform:uppercase;color:#004A61;opacity:0.4;">
                LAY DAY GILI T
              </p>
            </td>
          </tr>

          <!-- HERO CARD -->
          <tr>
            <td style="background-color:#004A61;border-radius:2px;padding:48px 40px;text-align:center;">
              <p style="margin:0 0 16px;font-size:40px;line-height:1;">🌴</p>
              <h1 style="margin:0 0 12px;font-size:32px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#ffffff;line-height:1.15;">
                Hey ${firstName},<br/>you&rsquo;re in the mix!
              </h1>
              <div style="width:40px;height:3px;background-color:#EE5B2B;margin:20px auto;"></div>
              <p style="margin:0;font-size:14px;font-weight:500;color:rgba(255,255,255,0.75);line-height:1.8;max-width:400px;margin-left:auto;margin-right:auto;">
                We&rsquo;ve received your application for <strong style="color:#EE5B2B;">Gili Creator Week</strong> at Lay Day Gili T 
                and we&rsquo;re genuinely excited to review it. Our team goes through every application carefully — 
                if you&rsquo;re the right fit, we&rsquo;ll reach out personally within the next few days. 🌊
              </p>
            </td>
          </tr>

          <!-- WHAT HAPPENS NEXT -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;border-top:3px solid #EE5B2B;">
              <p style="margin:0 0 20px;font-size:10px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:#EE5B2B;">
                What happens next
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #EBE7E0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <div style="width:24px;height:24px;background-color:#EE5B2B;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#ffffff;font-size:11px;font-weight:700;">1</span>
                          </div>
                        </td>
                        <td style="font-size:13px;font-weight:600;color:#004A61;letter-spacing:0.5px;">
                          We review your application &amp; social profile
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #EBE7E0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <div style="width:24px;height:24px;background-color:#EE5B2B;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#ffffff;font-size:11px;font-weight:700;">2</span>
                          </div>
                        </td>
                        <td style="font-size:13px;font-weight:600;color:#004A61;letter-spacing:0.5px;">
                          Selected creators get a personal message from our team
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;">
                          <div style="width:24px;height:24px;background-color:#EE5B2B;border-radius:50%;text-align:center;line-height:24px;">
                            <span style="color:#ffffff;font-size:11px;font-weight:700;">3</span>
                          </div>
                        </td>
                        <td style="font-size:13px;font-weight:600;color:#004A61;letter-spacing:0.5px;">
                          We lock in dates &amp; welcome you to the crew 🤙
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#EBE7E0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 20px;font-size:13px;color:#004A61;opacity:0.7;line-height:1.7;">
                While you wait — follow us on Instagram and stay close to the island vibes. 🏄
              </p>
              <a href="https://www.instagram.com/laydaygilit"
                 style="display:inline-block;background-color:#EE5B2B;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;padding:14px 36px;">
                FOLLOW @LAYDAYGILIT
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px;text-align:center;border-top:1px solid rgba(0,74,97,0.1);">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#004A61;opacity:0.3;">
                © ${new Date().getFullYear()} Lay Day Gili T &nbsp;·&nbsp; Gili Trawangan, Indonesia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function sendConfirmationEmail(
  toEmail: string,
  firstName: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  const name = firstName.split(" ")[0] || "there"; // use first name only

  const { error } = await resend.emails.send({
    from: "Lay Day Gili T <hello@laydaycreators.com>",
    to: [toEmail],
    subject: "You applied 🌴 — Gili Creator Week",
    html: buildEmailHtml(name),
  });

  if (error) {
    throw new Error(`[Email] Resend error: ${JSON.stringify(error)}`);
  }

  console.log(`[Email] Confirmation sent to ${toEmail}`);
}
