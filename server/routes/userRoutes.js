import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/userControllers.js";

const router = express.Router();

router.use(protect, adminOnly); // All protected & admin-only

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
