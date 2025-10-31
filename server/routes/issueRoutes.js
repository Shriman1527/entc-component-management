import express, { Router } from 'express';
import {
    issueComponent,
    getAllIssues,
    getStudentIssues,
    markAsReturned
} from '../controllers/issueControllers.js';

import { protect,adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

//this routes for admin to issue , view and mark as returned

router.post("/",protect,adminOnly,issueComponent);
router.get("/",protect,adminOnly,getAllIssues);
router.put("/:id/return",protect,adminOnly,markAsReturned);

//below for student to viewed thier issued component
router.get("/student/:id",protect,getStudentIssues);

export default router;


