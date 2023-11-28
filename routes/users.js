const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');
const userController = require('../controllers/users');

const userAuthentication = require('../middleware/auth');


const router = express.Router();


router.post('/signup', userController.signup)

router.post('/login',userController.login)

router.post('/getExpenses/:pageNo',userAuthentication.authentication ,expenseController.getExpenses);

router.post('/addExpense',userAuthentication.authentication,expenseController.addExpenses);

router.delete('/deleteExpense/:userId',userAuthentication.authentication,expenseController.deleteExpenses);



module.exports = router;









