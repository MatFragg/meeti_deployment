import Sequelize from 'sequelize';
import db from '../config/db.js'

const Categories = db.define('categories',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    slug: Sequelize.TEXT
},{
    timestamps: false
});

export default Categories;