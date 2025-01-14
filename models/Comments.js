import Sequelize from 'sequelize';
import db from '../config/db.js';
import {v4 as uuidv4} from "uuid";
import Users from './Users.js';
import Meeti from './Meeti.js';

const Comments = db.define('comments',{
    id : {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuidv4()
    },
    message : Sequelize.TEXT,
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    meetiId: {
        type: Sequelize.UUID,
        references: {
            model: 'meetis',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
});



export default Comments;