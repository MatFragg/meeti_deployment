import Sequelize from 'sequelize';
import db from '../config/db.js';

const CategoriesGroups = db.define('categoriesGroups', {
    groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: 'groups',
            key: 'id'
        }
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
});


export default CategoriesGroups;