import {
    Categories,
    Groups,
    CategoriesGroups,
    Meeti,
    Users,
    Comments
} from '../models/associations.js';
//import Categories from '../models/Categories.js'
//import CategoriesGroups from '../models/CategoriesGroups.js'
//import Groups from '../models/groups.js'
//import Meeti from '../models/Meeti.js'
//import Users from '../models/Users.js';
import moment from 'moment';
import Sequelize from 'sequelize';
import { Op } from 'sequelize';

const home = async (req,res) => {
    // Promise for queries
    const queries = [];
    queries.push(Categories.findAll({}));
    queries.push(Meeti.findAll({  
        attributes : ['slug','title','date','hour'], // Extracts the data you need
        where : {
            date : { [Op.gte] : moment(new Date()).format('YYYY-MM-DD')}
        },limit:3, order:[['date','ASC']], include: [{ model:Groups,attributes: ['image']},{model: Users, attributes: ['name','image']}] }));

    const [categories,meetis] = await Promise.all(queries);

    res.render('home',{
        pageName: 'Home',
        categories,
        meetis,
        moment
    });
}

const show_meeti = async(req,res) => {
    const meeti = await Meeti.findOne({where: {slug: req.params.slug},include: [{ model: Groups},{model : Users, attributes: ['id','name','image']}]});

    // If the meeti does not exist
    if(!meeti){
        res.redirect('/')
    }


    // Query to get the meeti location (closer to the current meeti)
    // ST_GeomFromText is a function that converts a string into a point
    const location = Sequelize.literal(`ST_GeomFromText('POINT(${meeti.location.coordinates[0]} ${meeti.location.coordinates[1]})')`);

    // ST_DISTANCE_SPHERE is a function that calculates the distance between two points
    const distance = Sequelize.fn('ST_DistanceSphere', Sequelize.col('location'), location);

    // Find the meetis that are closer to the current meeti
    const closeMeetis = await Meeti.findAll({
        order: distance,
        where: Sequelize.where(distance, { [Op.lte]: 2000 }),
        limit: 3,
        offset: 1,
        include: [
            {
                model: Groups
            },
            {
                model: Users,
                attributes: ['id','name','image']
            }
        ]
    })


    const comments = await Comments.findAll({where: {meetiId: meeti.id},include: [{model: Users, attributes: ['id','name','image']}]});

    // Show the result in the Front-End
    res.render('show-meeti',{
        pageName: meeti.title,
        meeti,
        comments,
        closeMeetis,
        moment
    })
}

const confirm_attendance = async(req,res) => {
    // This Sequelize.fn() function is used to update the array of attendants in the database
    // The array_append function is used to add the user's ID to the array of attendants
    console.log(req.body)

    const { clickAction } = req.body;

    if(clickAction === 'confirm'){
        // Confirm User Attendance
        Meeti.update(
            {'attendees': Sequelize.fn('array_append', Sequelize.col('attendees'),req.user.id)},
            {'where': {'slug': req.params.slug}});
        res.send('Attendance Confirmed');
    } else {
        // Cancel User Attendance
        Meeti.update(
            {'attendees': Sequelize.fn('array_remove', Sequelize.col('attendees'),req.user.id)},
            {'where': {'slug': req.params.slug}});
        res.send('Attendance Cancelled');
    }
    
}

const show_attendees = async(req,res) => {
    const meeti = await Meeti.findOne({where: {slug: req.params.slug},attributes: ['attendees']});

    const { attendees } = meeti;

    const attendeesData = await Users.findAll({
        attributes: ['name','image'],
        where: {id: attendees}
    });

    res.render('show-attendees',{
        pageName: 'Attendees Meeti',
        attendeesData
    })
}

const show_user = async(req,res,next) => {
    const queries = [];
    queries.push(Users.findOne({where: {id: req.params.id}}));
    queries.push(Groups.findAll({where: {userId: req.params.id}}));

    const [user,groups] = await Promise.all(queries);
    if(!user){
        res.redirect('/');
        return next();
    }

    res.render('show-user',{
        pageName: `Profile: ${user.name}`,
        user,
        groups
    })
}
const show_group = async(req,res,next) => {
    const queries = [];

    queries.push(Groups.findOne({where: {id: req.params.id}}));
    queries.push(Meeti.findAll({where: {groupId: req.params.id}, order:[['date','ASC']]}));

    const [group,meetis] = await Promise.all(queries);

    if(!group){
        res.redirect('/');
        return next();
    }

    res.render('show-group',{
        pageName: `Group: ${group.name}`,
        group,
        meetis,
        moment
    })
}
const show_meeti_category = async(req,res,next) => {
    const category = await Categories.findOne({where: {slug: req.params.category}});

    const meeties = await Meeti.findAll({
        order : [['date','ASC'], ['hour','ASC']],
        include: [
            {
                model: Groups,
                include: [
                    {
                        model: Categories,
                        through: { model: CategoriesGroups, where: { categoryId: category.id } },
                        attributes: ['name']
                    }
                ]
            },
            { model: Users }
        ]
    });

    res.render('category',{
        pageName: `Category: ${category.name}`,
        category,
        meeties,
        moment
    })
}

const add_comment = async(req,res,next) => {
    // { comment } = req.body;
    const { comment } = req.body;

    // Create the comment
    await Comments.create({
        message: comment,
        userId: req.user.id,
        meetiId: req.params.id
    });
    res.redirect('back');
    return next();
}

const delete_comment = async(req,res,next) => {
    //res.send('Delete Comment');

    const {commentId} = req.body;

    const comment = await Comments.findOne({where: {id: commentId}});

    if (!comment) {
        res.status(404).send('Action not allowed');
        return next();
    }

    const meeti = await Meeti.findOne({where: {id: comment.meetiId}});

    if(comment.userId === req.user.id || meeti.userId === req.user.id){
        await Comments.destroy({where: {id: comment.id}});
        res.status(200).send('Comment Deleted');
        return next();
    } else {
        res.status(403).send('Action not allowed');
        return next();
    }
}

const searchResults = async(req,res) => {
    //console.log(req.query);
    const { category, title,city,country } = req.query;

    // If category is empty
    let query
    if(!category === ''){
        query = '';
    } else{
        query = `where : { categoryId: {[Op.eq] : category} }`
    }

    // filter the query
    const meetis = await Meeti.findAll({
        where: {
            title: {[Op.iLike] : '%'+ title + '%'},
            city: {[Op.iLike] : '%'+ city + '%'},
            country: {[Op.iLike] : '%'+ country + '%'},
        },
        include : [
            {
                model: Groups,
                include: [
                    {
                        model: Categories,
                        through: { model: CategoriesGroups,query},
                        attributes: ['name']
                    }
                ]
            },
            { model: Users, attributes: ['id','name','image']}
        ]
    });

    res.render('search-results',{
        pageName: 'Search Results',
        meetis,
        moment
    })
}


export {
    home,
    show_meeti,
    confirm_attendance,
    show_attendees,
    show_user,
    show_group,
    show_meeti_category,
    add_comment,
    delete_comment,
    searchResults
}