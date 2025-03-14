import Sequelize from "sequelize";
import db from '../config/db.js'
import {v4 as uuidv4} from "uuid";
import slug from 'slug'
import shortid from "shortid";

import Users from "../models/Users.js";
import Groups from "../models/groups.js";

const Meeti = db.define(
    'meetis',{
        id : {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv4()
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg: 'Add a Title'
                }
            }
        },
        slug: {
            type: Sequelize.STRING
        },
        guest : Sequelize.STRING,
        slot : {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        description : {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a description'
                }
            }
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a date'
                }
            }
        },
        hour: {
            type: Sequelize.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg:'Add a hour to the Meeti'
                }
            }
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg:'Add an Address'
                }
            }
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg:'Add a City'
                }
            }
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg:'Add an state'
                }
            }
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty : {
                    msg:'Add a Country'
                }
            }
        },
        location: {
            type: Sequelize.GEOMETRY('POINT'),
        },
        attendees : {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: []
        }
    },{
        hooks: {
            async beforeCreate(meeti){
                const url = slug(meeti.title).toLowerCase();
                meeti.slug = `${url}-${shortid.generate()}`;
            }
        }
});

export default Meeti;