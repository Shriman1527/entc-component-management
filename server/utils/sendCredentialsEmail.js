import nodemailer from "nodemailer";

const sendCredentialsEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    // FIX: Use 'service' for Gmail, or 'host: smtp.gmail.com'
    service: "gmail", 
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
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to ENTC Lab System</h2>
        <p>Your student account has been created successfully.</p>
        <p><strong>Login ID:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <br/>
        <p>Please login and change your password if required.</p>
      </div>
    `,
  });
};

export default sendCredentialsEmail;