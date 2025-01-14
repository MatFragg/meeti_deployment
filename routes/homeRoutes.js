import express from 'express';
import {home,show_meeti,confirm_attendance,show_attendees,show_user,show_group,show_meeti_category,add_comment,delete_comment,searchResults} from '../controllers/homeController.js'

const router = express.Router();

router.get('/', home);

router.get('/meeti/:slug',show_meeti);
router.post('/confirm-attendance/:slug', confirm_attendance);

router.get('/attendees/:slug',show_attendees);

router.get('/users/:id', show_user);

router.get('/groups/:id', show_group);

router.get('/category/:category', show_meeti_category);

router.post('/meeti/:id',add_comment);
router.post('/delete-comment',delete_comment);

router.get('/search',searchResults)

export default router;