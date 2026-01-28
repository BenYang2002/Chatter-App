import {handleRegister} from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();
router.post('/register',(req,res)=>{
    const result=handleRegister(req,res);
})

export default router;