import express from 'express'
import { check_auth } from '../controllers/authController.js';
import {newGroup_form,upload_image,create_group,edit_group_form,edit_group,edit_image_form,edit_image,delete_group_form,delete_group} from '../controllers/groupController.js'

const router = express.Router();

// New Groups
router.get('/new-group', check_auth,newGroup_form);
router.post('/new-group',check_auth,upload_image,create_group);

// Edit Groups
router.get('/edit-group/:groupId',check_auth, edit_group_form);
router.post('/edit-group/:groupId',check_auth, edit_group);

// Edit Images
router.get('/image/:groupId',check_auth,edit_image_form);
router.post('/image/:groupId',check_auth,upload_image,edit_image);

// Delete Groups
router.get('/delete-group/:groupId',check_auth,delete_group_form);
router.post('/delete-group/:groupId',check_auth,delete_group);

export default router