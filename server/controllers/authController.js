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


    //----- // SEND COOKIE
    res.cookie('jwt', token, {
      httpOnly: true, // JavaScript cannot read this (Protects against XSS)
      // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      secure:false,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',// Protects against CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    //-------


    // res.json({
    //   message: "Login successful",
    //   token,
    //   user: {
    //     id: user._id,
    //     role: user.role,
    //     name: user.name,
    //     rollNo: user.rollNo || null,
    //     email: user.email,
    //   },
    // });


    //
    // Send user data (BUT NOT THE TOKEN) in JSON
    res.json({
      message: "Login successful",
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



//----------- New functionn

// ADD A LOGOUT FUNCTION
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0) // Expire the cookie immediately
  });
  res.status(200).json({ message: 'Logged out' });
};

//---

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
