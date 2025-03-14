import Users from '../models/Users.js'
import {sendEmail,resendFunction} from '../handlers/email.js'
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import shortid from "shortid";
import {dirname,join} from 'path';
import { fileURLToPath } from "url";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileStorage = multer.diskStorage({
    destination: (req,file,next) =>{
        next(null, join(__dirname , '/../public/uploads/profiles/'))
    },
    filename: (req,file,next) =>{
        const extention = file.mimetype.split('/')[1];
        next(null, `${shortid.generate()}.${extention}`);
    }
});

const multerConfig = {
    limits: { fileSize : 100000}, // Limits fileSize
    storage: fileStorage,
    fileFilter(req,file,next) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            next(new Error('Only JPEG and PNG images are allowed'));
        } else {
            next(null,true);
        }
    }
};

// Config for multer and single takes the image field
const upload = multer(multerConfig).single('image');

// Upload image to the server
const upload_image = async(req,res,next) => {
    upload(req,res,function(error){
        if (error) {
            //console.log(error);
            // Manage Errors
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error','The file size is too large')
                } else {
                    req.flash('error',error.message);
                }
            } else if(error.hasOwnProperty('message')){
                req.flash('error',error.message)
                // This has been done due to the fact that we are generating a new Error
            }
            return res.redirect(req.get('Referrer') || '/');
        } else {
            next();
        }
    })
}

// Create Account
const form_create_account = (req,res) => {
    res.render('create-account',{
        pageName: 'Create an Account'
    });
}
const create_account = async (req,res) => {
    const user = req.body;

    await body('confirm','Password confirmation is required').notEmpty().run(req);
    await body('confirm','Passwords do not match').equals(req.body.password).run(req);

    // Read Express errors
    const expressErrors = validationResult(req);

    try {
        user.id = shortid.generate();
        await Users.create(user);

        // Generate confirmation URL
        const url = `http://${req.get('host')}/confirm-account/${user.email}`

        // Send confirmation email
        await resendFunction({
            user,
            url,
            subject: 'Confirm your Meeti Account',
            archive: 'confirm-account'
        })

        // Flash message and redirect
        req.flash('exito','We have sent an email to confirm your account');
        res.redirect('/login');
        
    } catch (error) {
        console.error('Error caught:', error); 
        // Extract Sequelize  errors
        let sequelizeErrors = [];
        if (error.name === 'SequelizeUniqueConstraintError' && error.errors) {
            sequelizeErrors = error.errors.map(err => err.message);
            console.log(sequelizeErrors);
        }

        // Extract error expression
        let errExp = [];
        if(!expressErrors.isEmpty()){
            const errExp = expressErrors.array().map(err => err.msg);
            console.log(errExp);
        }

        // Joining errors
        const errorList = [...sequelizeErrors,...errExp];
        
        console.log('Sequelize Errors:', sequelizeErrors);
        console.log('Combined Error List:', errorList);

        if (errorList.length > 0) {
            req.flash('error', errorList);
        } else {
            req.flash('error', 'An unexpected error occurred');
            
        }
        res.redirect('/create-account');
    }
}

// Confirm Account
const confirm_account = async(req,res,next) => {
    // Verify if the user exists
    const user = await Users.findOne({where: {email: req.params.mail}});

    // If there is no user
    if(!user){
        req.flash('error','The account does not exist');
        res.redirect('/create-account');
        return next();
    }

    // If a user exists, confirm and redirect
    user.active = 1;
    await user.save();
    req.flash('exito','The account has been confirmed, you can Log-In now');
    res.redirect('/login');
}


// Login
const form_login = (req,res) => {
    res.render('login',{
        pageName: 'Login'
    });
}

const edit_profile_form = async(req,res )=>{
    const user = await Users.findByPk(req.user.id);

    res.render('edit-profile',{
        pageName: `Edit Profile : ${user.name}`,
        user
    })
}

const edit_profile = async(req,res)=>{
    const user = await Users.findByPk(req.user.id);
    
    body('name').run(req);
    body('email').run(req);


    // Read data from form
    const {name,description,email} = req.body

    // Asign values
    user.name = name;
    user.description = description;
    user.email= email;

    await user.save();
    req.flash('exito','Changes have been saved successfully');
    res.redirect('/meeti-admin');
}

const update_password_form = (req,res)=>{
    res.render('update-password',{
        pageName: 'Update Password'
    })
}

const update_password = async(req,res,next) =>{
    const user = await Users.findByPk(req.user.id);

    // Verify if the Current Password is correct
    if(!user.validatePassword(req.body.current_password)){
        req.flash('error','Current Password is incorrect');
        res.redirect('/update-password');
        return next();
    }

    // If password is correct , hash it
    const hash = user.hashPassword(req.body.new_password);

    // Asign the password to the user
    user.password = hash;

    await user.save();

    req.logout();
    req.flash('exito','Password has been updated successfully, Login again');
    res.redirect('/meet-admin')

}

const upload_image_form = async(req,res) => {
    const user = await Users.findByPk(req.user.id);

    res.render('profile-image',{
        pageName: `Upload Profile Image : ${user.name}`,
        user
    })
}

const save_image = async(req,res,next) => {
    const user = await Users.findByPk(req.user.id);

    // If there exists an old image and a new one , it means we need to delete the old one
    if(req.file && user.image){
        const oldImage = __dirname + `/../public/uploads/profiles/${user.image}`;

        // To delete or replace an archive with node, we gotta use fs unlink (this way is an asynchronous function)
        fs.unlink(oldImage, (error) =>{
            if(error) {
                console.log(error);
            }
            return;
        })

    }
    // If there does not exist an image but there is a new one, we need to save it
    if(req.file){
        user.image = req.file.filename;
    } 

    console.log(req.file);

    // Save the Profile
    await user.save();
    req.flash('exito','The Profile has been updated successfully');
    res.redirect('/meeti-admin');
}




export {
    upload_image,
    form_create_account,
    create_account,
    confirm_account,
    form_login,
    edit_profile_form,
    edit_profile,
    update_password_form,
    update_password,
    upload_image_form,
    save_image
}