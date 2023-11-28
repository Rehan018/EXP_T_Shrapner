const Sequelize = require('sequelize');


require('dotenv').config()



const sequelize = new Sequelize( 'Expense_Tracker','root','', {

    dialect: 'mysql',
    host: 'localhost',
    });



    //connecting sequelize to db create connection pool

   
module.exports = sequelize;