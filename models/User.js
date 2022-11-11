const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model{
    // checks to see if the login password is the same as the password entered by the user 
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            // type: DataTypes.UUID, 
            // defaultValue: DataTypes.UUIDV4, 
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false, 
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true, // unique is ??? 
            validate: {isEmail: true} // checks for email format 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {len: [4]}
        }
    },
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10); 
                return newUserData; 
            }, 

            async beforeUpdate(updatedUserData) {
                updatedUserData.password= await bcrypt.hash(updatedUserData.password, 10); 
                return updatedUserData; 
            }
        }, 
        sequelize, 
        timestamps: false, 
        freezeTableName: true, 
        underscored: true, 
        modelName: 'user'
    }
);

module.exports = User; 