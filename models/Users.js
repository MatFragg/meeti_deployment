import Sequelize from "sequelize"
import db from "../config/db.js"
import bcrypt from "bcrypt-nodejs"

const Users = db.define('users',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {msg: 'Name field cannot be empty'}
        }
    },
    image: Sequelize.STRING(60),
    description: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {msg: 'Add a valid email'}
        },
        unique: {
            args: true,
            msg: 'User already registered'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {msg: 'The password cannot be empty'}
        }
    },
    active:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expirationToken: Sequelize.DATE
},{
    hooks:{
        beforeCreate(user){
            user.password = Users.prototype.hashPassword(user.password);
        }
    }
});

// Method to compare passwords
Users.prototype.validatePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

Users.prototype.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

export default Users;