import Groups from "../models/groups.js";
import Meeti from "../models/Meeti.js";
import {body}  from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

// Shows form for new Meetis
const newMeeti_form = async(req,res) => {
    const groups =await Groups.findAll({where: {userId: req.user.id}});
    res.render('new-meeti',{
        pageName: 'Create a new Meeti',
        groups
    })
}

const sanitize_meeti = (req,res,next) =>{
    body('title').run(req);
    body('guest').run(req);
    body('slot').run(req);
    body('date').run(req);
    body('hour').run(req);
    body('address').run(req);
    body('city').run(req);
    body('state').run(req);
    body('country').run(req);
    body('lat').run(req);
    body('lng').run(req);
    body('groupId').run(req);

    next();
}

// Insert new Meetis in the DB
const create_meeti = async(req,res) =>{
    // Get the dates
    const meeti = req.body;

    
    // asign the user
    meeti.userId = req.user.id;
    console.log(meeti);

    // Stores the Location in a point
    const point = {type : 'Point', coordinates : [parseFloat(req.body.lat), parseFloat(req.body.lng)]};

    meeti.location = point;

    // Slot is optional
    if(req.body.slot === ''){
        meeti.slot = 1;
    }

    meeti.id = uuidv4();

    // Store in DB
    try {
        await Meeti.create(meeti);
        req.flash('exito','The Meeti has been created successfully ')
        res.redirect('/meeti-admin');
    } catch (error) {
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
        res.redirect('/new-meeti');
    }
}

const edit_meeti_form = async (req,res) =>{
    const queries = [];
    queries.push(Groups.findAll({where: {userId: req.user.id}}));
    queries.push(Meeti.findByPk(req.params.id));

    // Array Destryctyrung
    const [group,meeti] = await Promise.all(queries);

    if(!group || !meeti){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin')
        return next();
    }

    res.render('edit-meeti',{
        pageName: `Edit Meeti : ${meeti.title}`,
        group,
        meeti
    })
}

const edit_meeti = async (req,res,next) =>{
    const meeti = await Meeti.findOne({where: {id: req.params.id, userId: req.user.id}});

    if(!meeti) {
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin')
        return next();
    }

    // Asign values
    const { groupId,title,guest, date,hour,slot,description, address,city,state,country,lat,lng} = req.body;

    meeti.groupId = groupId;
    meeti.title = title;
    meeti.guest = guest;
    meeti.date = date;
    meeti.hour = hour;
    meeti.slot = slot;
    meeti.description = description;
    meeti.address = address;
    meeti.city = city;
    meeti.state = state;
    meeti.country = country;
    
    const point = {type: 'Point', coordinates : [parseFloat(req.body.lat), parseFloat(req.body.lng)]};

    meeti.location = point;

    await meeti.save();
    req.flash('exito','The Meeti has been updated successfully ')
    res.redirect('/meeti-admin');
}

const delete_meeti_form = async(req,res) =>{
    const meeti = await Meeti.findOne({where: {id: req.params.id, userId: req.user.id}});
    
    if(!meeti){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin');
    }

    // Everythin is ok

    res.render('delete-group',{
        pageName: `Delete Meeti : ${meeti.name}`,
        meeti
    })
}

const delete_meeti = async(req,res) =>{
    const meeti = await Meeti.findOne({where: {id: req.params.id, userId: req.user.id}});

    if(!meeti){
        req.flash('error','Invalid Operation');
        res.redirect('/meeti-admin');
    }

    await Meeti.destroy({
        where:{
            id:req.params.id
        }
    });
    req.flash('exito','The Group has been deleted successfully')
    res.redirect('/meeti-admin')
}

export {
    newMeeti_form,
    sanitize_meeti,
    create_meeti,
    edit_meeti_form,
    edit_meeti,
    delete_meeti_form,
    delete_meeti
}