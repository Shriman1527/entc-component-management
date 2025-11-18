import bcrypt from "bcryptjs";
const hash = await bcrypt.hash("your_password_here", 10);
console.log(hash);
