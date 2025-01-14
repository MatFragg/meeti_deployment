import Users from "../models/Users.js";
import Groups from "../models/groups.js";
import Meeti from "../models/Meeti.js";
import moment from 'moment'
import {Sequelize, Op} from "sequelize";

const admin_panel = async (req,res) => {

    moment(new(Date)).format('YYYY-MM-DD')

    const queries = [];
    queries.push(Groups.findAll({where: {userId: req.user.id}}));
    queries.push(Meeti.findAll({where: {userId: req.user.id, date: {[Op.gte] : moment(new Date()).format('YYYY-MM-DD')}},
    order: [['date','ASC']]}));
    queries.push(Meeti.findAll({where: {userId: req.user.id, date: {[Op.lt] : moment(new Date()).format('YYYY-MM-DD')}}}));

    // Array Destryctyrung
    const [groups,meeti,pastMeeti] = await Promise.all(queries);



    res.render('admin',{
        pageName: 'Administration Panel',
        groups,
        meeti,
        pastMeeti,
        moment
    })
}

export {
    admin_panel
}