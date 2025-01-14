import Categories from './Categories.js';
import Groups from './groups.js';
import CategoriesGroups from './CategoriesGroups.js';
import Meeti from './Meeti.js';
import Users from './Users.js';
import Comments from './Comments.js';

// Define associations
Groups.belongsToMany(Categories, { through: CategoriesGroups, foreignKey: 'groupId' });
Categories.belongsToMany(Groups, { through: CategoriesGroups, foreignKey: 'categoryId' });

CategoriesGroups.belongsTo(Categories, { foreignKey: 'categoryId' });
CategoriesGroups.belongsTo(Groups, { foreignKey: 'groupId' });
Groups.belongsTo(Users, { foreignKey: 'userId' });
Groups.hasMany(Meeti, { foreignKey: 'groupId' });
Meeti.belongsTo(Groups, {foreignKey : 'groupId',onDelete: 'CASCADE'});
Meeti.belongsTo(Users, { foreignKey: 'userId' });


// Users and Comments
Users.hasMany(Comments, { foreignKey: "userId", onDelete: "CASCADE" });
Comments.belongsTo(Users);
Meeti.hasMany(Comments, { foreignKey: "meetiId", onDelete: "CASCADE" });
Comments.belongsTo(Meeti);

export {
    Categories,
    Groups,
    CategoriesGroups,
    Meeti,
    Users,
    Comments
};