import express from 'express'
import {admin_panel} from '../controllers/meetiAdminController.js'
import {check_auth} from '../controllers/authController.js'

const router = express.Router();

// Admin Panel
router.get('/meeti-admin',check_auth, admin_panel);

export default router