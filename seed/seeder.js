import { groups,categoriesGroup} from './groups.js';
import meeti from './meeti.js'
import Groups from '../models/groups.js';
import CategoriesGroups from '../models/CategoriesGroups.js';
import Meeti from '../models/Meeti.js';
import db from '../config/db.js';

const importData = async() =>{
    try {
        // Authenticate
        await db.authenticate()

        await db.sync()

        // Insert Data with bulkCreate
        //await Groups.bulkCreate(groups)
        //await CategoriesGroups.bulkCreate(categoriesGroup)
        await Meeti.bulkCreate(meeti)
        console.log('Data imported successfully');
        process.exit()

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const deleteData = async () =>{
    try {
        await db.authenticate();

        // Delete data in the correct order
        await CategoriesGroups.destroy({ where: {}, force: true });
        await Meeti.destroy({ where: {}, force: true });
        await Groups.destroy({ where: {}, force: true });
        console.log('Data deleted successfully');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === '-i'){
    importData();
}
if(process.argv[2] === '-e'){
    deleteData();
}