const jwt = require('jsonwebtoken');

const User = require('../models/user');



const authentication = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        //console.log(token);
        const user = jwt.verify(token, 'whereistoken')
        //console.log(user.userId);

        User.findByPk(user.userId).then(user=>{  //return u id of the row in table id=1 like that
            console.log(JSON.stringify(user));
            req.user =user;  //global req object accross funcitons
            next();
        }).catch(err=>console.log(err))


    }
    catch(error)
    {
        console.log(error);
    }
}



module.exports = {authentication};