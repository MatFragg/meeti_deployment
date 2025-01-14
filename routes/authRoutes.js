import express from 'express'
import {auth_user} from '../controllers/authController.js'

const router = express.Router();

// Authenticate User
router.post('/login',auth_user);

export default router;
