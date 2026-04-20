import { Resend } from "resend";

let resendClient = null;

const getResendClient = () => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
};

const buildRegistrationEmailHtml = ({ name }) => {
  const safeName = name || "Customer";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #ea580c;">Welcome to Urban Foods</h2>
      <p style="margin: 0 0 10px;">Hello ${safeName},</p>
      <p style="margin: 0 0 12px;">Your account was created successfully.</p>
      <p style="margin: 0 0 10px;">You can now sign in and start ordering your favorite meals.</p>
      <p style="margin: 0;">Regards,<br/>Urban Foods Team</p>
    </div>
  `;
};

export const sendCustomerRegistrationEmail = async ({ name, email }) => {
  const to = (email || "").trim();
  if (!to) return;

  const client = getResendClient();
  if (!client) {
    console.log("Registration email skipped: RESEND_API_KEY not set.");
    return;
  }

  const from = (process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim();
  const appName = (process.env.APP_NAME || "Urban Foods").trim();

  const { error } = await client.emails.send({
    from,
    to: [to],
    subject: `${appName} - Welcome`,
    html: buildRegistrationEmailHtml({ name }),
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send registration email");
  }
};
