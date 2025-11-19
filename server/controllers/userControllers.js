import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendCredentialsEmail from "../utils/sendCredentialsEmail.js";
import nodemailer from "nodemailer";


const sendUpdateEmail = async (email, name, rollNo) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ENTC Lab System" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "ENTC Profile Updated",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Profile Updated</h2>
        <p>Hello ${name},</p>
        <p>Your student profile details have been updated by the Admin.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Roll No:</strong> ${rollNo}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p>If you did not request this change, please contact the department.</p>
      </div>
    `,
  });
};


// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNo } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const password = rollNo;
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      rollNo,
      role: "student",
      password: hashedPassword,
    });

    // send login credentials email
    await sendCredentialsEmail(email, password);

    res.status(201).json({ message: "Student created", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET SINGLE STUDENT
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE STUDENT (email, name, rollNo)
// export const updateStudent = async (req, res) => {
//   try {
//     const { name, email, rollNo } = req.body;

//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       { name, email, rollNo },
//       { new: true }
//     );

//     res.json({ message: "Updated", updated });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNo } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, rollNo },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    // Send email notification to the NEW email address
    try {
        await sendUpdateEmail(email, name, rollNo);
    } catch (emailError) {
        console.error("Failed to send update email:", emailError);
        // We don't fail the request if email fails, just log it
    }

    res.json({ message: "Student updated and email sent", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
