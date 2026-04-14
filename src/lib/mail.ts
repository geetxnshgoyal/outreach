import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOutreachEmail(count: number, eventName: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.OUTREACH_EMAIL, // Notify the outreach team
    subject: `🔔 New Registrations: ${eventName}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6d28d9;">New Registrations Updated</h2>
        <p>Hello Outreach Team,</p>
        <p>The Admin has just uploaded <strong>${count}</strong> new registrations for the event: <strong>${eventName}</strong>.</p>
        <p>Please log in to the portal to check and start the calling process.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #6d28d9; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Go to Portal</a>
        <p style="margin-top: 20px; font-size: 0.8em; color: #777;">This is an automated notification from the AAYAM Outreach Portal.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
