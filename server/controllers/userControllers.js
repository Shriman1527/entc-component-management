import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendCredentialsEmail from "../utils/sendCredentialsEmail.js";

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
export const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNo } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, rollNo },
      { new: true }
    );

    res.json({ message: "Updated", updated });
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
