import express from 'express'
import { check_auth } from '../controllers/authController.js';
import {newMeeti_form,sanitize_meeti,create_meeti,edit_meeti_form,edit_meeti,delete_meeti_form,delete_meeti} from '../controllers/meetiController.js'

const router = express.Router();

router.get('/new-meeti', check_auth,newMeeti_form);
router.post('/new-meeti', check_auth,sanitize_meeti,create_meeti);

router.get('/edit-meeti/:id', check_auth, edit_meeti_form);
router.post('/edit-meeti/:id', check_auth, edit_meeti);

router.get('/delete-meeti/:id',check_auth, delete_meeti_form);
router.post('/delete-meeti/:id',check_auth,delete_meeti);
export default router