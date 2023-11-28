const Sequelize =require('sequelize');
const sequelize = require('../util/database');



const Downloadurl = sequelize.define('downloadurl' , {
    id:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    filename:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    fileURL:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Downloadurl