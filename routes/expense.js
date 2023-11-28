const path = require('path');
const expenseController = require('../controllers/expense');

const middlewareAuthentication = require('../middleware/auth')

const express = require('express');
const userAuthentication = require('../middleware/auth');

const router = express.Router();



router.get('/premiums',middlewareAuthentication.authentication, expenseController.getAllUsers)

router.get('/getInfo/:loadUserId', middlewareAuthentication.authentication, expenseController.getLeaderBoardUser)

router.get('/download', middlewareAuthentication.authentication, expenseController.downloadExpense)

router.get('/getAllUrl', middlewareAuthentication.authentication, expenseController.downloadAllUrl)

module.exports = router;