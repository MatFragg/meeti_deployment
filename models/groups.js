import Sequelize from "sequelize";
import db from "../config/db.js";
import {v4 as uuidv4} from "uuid";
import Categories from "./Categories.js";
import Users from "./Users.js";
import CategoriesGroups from './CategoriesGroups.js';

const Groups = db.define('groups',{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4()
    },
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {msg: 'The group must have a name'}
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'The group description cannot be empty'
            }
        }
    },
    url: Sequelize.TEXT,
    image: Sequelize.TEXT,
})


export default Groups;