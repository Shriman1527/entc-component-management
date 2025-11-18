import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";




// LOGIN (ADMIN + STUDENT)
export const login = async (req, res) => { 
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        rollNo: user.rollNo || null,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
