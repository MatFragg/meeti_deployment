import Categories from "../models/Categories.js"
import Groups from "../models/groups.js"
import CategoriesGroups from "../models/CategoriesGroups.js";
import {body}  from 'express-validator';
import multer from 'multer';
import shortid from "shortid";
import {dirname,join} from 'path';
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileStorage = multer.diskStorage({
    destination: (req,file,next) =>{
        next(null, join(__dirname , '/../public/uploads/groups/'))
    },
    filename: (req,file,next) =>{
        const extention = file.mimetype.split('/')[1];
        next(null, `${shortid.generate()}.${extention}`);
    }
});

const multerConfig = {
    limits: { fileSize : 300000}, // Limits fileSize
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

// Form to create a new group
const newGroup_form = async(req,res) =>{
    const categories = await Categories.findAll()

    res.render('new-group',{
        pageName: 'Create a new Group',
        categories
    })
}

// Store the gorups in the DB
const create_group = async(req,res) => {
    // Sanitise fields
    await body('name').run(req);
    await body('url').run(req);

    const {name,description,category,url} = req.body;

    // Generate a unique ID for the new group
    const id = uuidv4();

    // Read image
    let image = req.file ? req.file.filename : null;

    try {
        // Store in BD
        const group = await Groups.create({
            id,
            name,
            description,
            image,
            url,
            userId: req.user.id // Stores the athenticated user in the group object
        });
        
        // Validate category
        if (!category || (Array.isArray(category) && category.length === 0)) {
            req.flash('error', 'You must select at least one category.');
            return res.redirect('/new-group');
        }

        // Associate the group with the selected categories
        let categories = Array.isArray(category) ? category : [category];  
        await group.setCategories(categories);

        req.flash('exito','The Groups has been created successfully')
        res.redirect('/meeti-admin')
    } catch (error) {
        // Extract Sequelize  errors
        let sequelizeErrors = [];
        if (error.name === 'SequelizeValidationError' && error.errors) {
            sequelizeErrors = error.errors.map(err => err.message);
            console.log(sequelizeErrors);
        }  
        
        if (sequelizeErrors.length > 0) {
            req.flash('error',sequelizeErrors);
        } else {
            req.flash('error', 'An error occurred while creating the group.');
        }
        console.error('Error creating group:', error);
        res.redirect('/new-group')
    }
}

const edit_group_form = async(req,res) => {
    //When we use async and await,we are waiting for the first promise to resolve before moving on to the next line, In some cases it might be correct, but in this one it is not due to categories has many to many relationship with groups and we need to fetch the categories associated with the group before we can render the form.
    //const group = await Groups.findByPk(req.params.groupId);
    //const categories = await Categories.findAll();

    // Instead of using async and await,we could use an empty array and then pushing the queries into it.
    const queries = [];
    queries.push(Groups.findByPk(req.params.groupId));
    queries.push(CategoriesGroups.findAll({ where: { groupId: req.params.groupId } }));
    queries.push(Categories.findAll());

    // Promise
    const [group,categoriesGroups,categories] = await Promise.all(queries);

    // Check if the group exists
    if (!group) {
        req.flash('error', 'Group not found');
        return res.redirect('/meeti-admin');
    }
    
    res.render('edit-group',{
        pageName: `Edit Group : ${group.name}`,
        group,
        categoriesGroups,
        categories
    })
}

// Saves changes in DB
const edit_group = async(req,res,next) => {
    const group = await Groups.findOne({where: {id: req.params.groupId, userId: req.user.id}});

    // If group does not exist or the user is not the owner of the group, redirect to home
    if (!group) {
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin');
        return next();
    }

    // Log the request body to debug
    //console.log('Request Body:', req.body);

    // Everything is fine, save the changes
    const {name,description,category,url} = req.body;
    group.name = name;
    group.description = description;
    group.url = url;

    // Log the type and value of the category field
    //console.log('Category Type:', typeof category);
    //console.log('Category Value:', category);   

    // Validate category
    if (!category || (Array.isArray(category) && category.length === 0)) {
        req.flash('error', 'Category is required');
        return res.redirect(`/edit-group/${req.params.groupId}`);
    }

    // Associate the group with the selected categories
    try {
        let categories = Array.isArray(category) ? category : [category];  
        await group.setCategories(categories);
    } catch (error) {
        console.error('Error associating categories:', error);
        req.flash('error', 'An error occurred while associating categories');
        return res.redirect(`/edit-group/${req.params.groupId}`);
    }

    // Save the group
    await group.save();
    req.flash('exito','The Group has been updated successfully')
    res.redirect('/meeti-admin')
}

// Edit Image Form
const edit_image_form = async(req,res) =>{
    const group = await Groups.findOne({where: {id: req.params.groupId, userId: req.user.id}});

    res.render('group-image',{
        pageName: `Edit Image : ${group.name}`,
        group
    })
}

// Modifies the image in DB and deletes the old one
const edit_image = async(req,res,next) => {
    const group = await Groups.findByPk(req.params.groupId);

    // If the group does not exist or is invalid
    if(!group){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-adming');
        return next();
    }

    // Verify that the archive is new
    /*if(req.file){
        console.log(req.file.filename);
    }

    // Verify the existence of an old image
    if(group.image){
        console.log(group.image);
    }*/

    // If there exists an old image and a new one , it means we need to delete the old one
    if(req.file && group.image){
        const oldImage = join(__dirname,'/../public/uploads/groups/',group.image);

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
        group.image = req.file.filename;
    }

    // Save the group
    await group.save();
    req.flash('exito','The Group has been updated successfully');
    res.redirect('/meeti-admin');
}

const delete_group_form = async(req,res,next) =>{
    const group = await Groups.findOne({where: {id: req.params.groupId, userId: req.user.id}});

    if(!group){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin');
    }

    // Everythin is ok

    res.render('delete-group',{
        pageName: `Delete Group : ${group.name}`,
        group
    })
}

const delete_group = async(req,res,next) => {
    const group = await Groups.findOne({where: {id: req.params.groupId, userId: req.user.id}});

    if(!group){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin');
    }

    // If there exists  a image
    if (group.image) {
        const oldImage = join(__dirname,'/../public/uploads/groups/',group.image);

        // To delete or replace an archive with node, we gotta use fs unlink (this way is an asynchronous function)
        fs.unlink(oldImage, (error) =>{
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    // Delete the group
    await Groups.destroy({
        where:{
            id:req.params.groupId
        }
    });

    
    req.flash('exito','The Group has been deleted successfully')
    res.redirect('/meeti-admin')
}

export {
    newGroup_form,
    upload_image,
    create_group,
    edit_group_form,
    edit_group,
    edit_image_form,
    edit_image,
    delete_group_form,
    delete_group
}