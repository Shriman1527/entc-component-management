import nodemailer from "nodemailer";

const sendCredentialsEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ENTC Lab System" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your ENTC Lab Login Credentials",
    html: `
      <h2>Your Student Account is Ready</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please login and change your password.</p>
    `,
  });
};

export default sendCredentialsEmail;
