import express from 'express';
import {upload_image,form_create_account, create_account,confirm_account,form_login,edit_profile_form,edit_profile,update_password_form,update_password,upload_image_form,save_image} from '../controllers/userController.js';
import { check_auth,log_out } from '../controllers/authController.js';

const router = express.Router();

// Create Account
router.get('/create-account', form_create_account);
router.post('/create-account', create_account);

// Confirm Account
router.get('/confirm-account/:mail',confirm_account);

// Login
router.get('/login', form_login );

router.get('/edit-profile', check_auth, edit_profile_form);
router.post('/edit-profile', check_auth, edit_profile);

router.get('/update-password', check_auth, update_password_form);
router.post('/update-password', check_auth, update_password);

router.get('/profile-image',check_auth, upload_image_form);
router.post('/profile-image',check_auth,upload_image, save_image);

router.get('/log-out',check_auth,log_out)

export default router;