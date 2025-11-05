import express from 'express';
import {
    addComponent,
    getComponents,
    updateComponent,
    deleteComponent,
    getComponentById
} from '../controllers/componentController.js'

import { protect,adminOnly } from '../middleware/authMiddleware.js';

const router=express.Router();

//all components

router.get("/",protect,getComponents);
router.get("/:id",protect,getComponentById);

//admin only routes
router.post("/",protect,adminOnly,addComponent);
router.put("/:id",protect,adminOnly,updateComponent);
router.delete("/:id",protect,adminOnly,deleteComponent);


export default router;



