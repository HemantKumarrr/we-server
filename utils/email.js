import nodemailer from "nodemailer";

const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

// transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "prod.me.community@gmail.com",
    pass: GOOGLE_APP_PASSWORD,
  },
});

// Function to send email
async function sendEmail(email, subject, message, template) {
  const mailOptions = {
    from: "prod.me.community@gmail.com",
    to: email,
    subject: subject,
    html: `${template(message)}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Call the function

export default sendEmail;
