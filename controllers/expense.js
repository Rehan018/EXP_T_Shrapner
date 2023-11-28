const Expense = require('../models/expense');

const User = require('../models/user')

const AWS = require('aws-sdk');

const Userservices = require('../service/userservices')

const S3services = require('../service/s3services');





exports.downloadExpense =  async(req,res,next)=>{
    try{

        

        const expenses = await Userservices.getExpenses(req)   //s3 funcationality 
//req.user.getExpenses();
        console.log(expenses);

        const stringyfyExpenses = JSON.stringify(expenses);
        //for creating a txt file we have to stringify it
        //because is an array rightnow

        const userId = req.user.id;

        const filename = `Expense${userId}/${new Date()}.txt`;

        const fileURL = await S3services.uploadToS3(stringyfyExpenses, filename);

        const downloadUrlData = await req.user.createDownloadurl({
            fileURL: fileURL,
            filename
        })

        res.status(200).json({fileURL,downloadUrlData, success:true})

    }
    catch(error){
         res.status(500).json({fileURL: '', success:false})
    }

}







exports.getAllUsers = async(req,res,next)=>{
    try {
        console.log(req.user.ispremiumuser);

        if(req.user.ispremiumuser){
            console.log("into getall Users");
            let leaderboard = [];
            let users = await User.findAll({attributes: ['id', 'username', 'email']})

            console.log(users);

            for(let i = 0 ;i<users.length ; i++){
                let expenses = await  users[i].getExpenses() ;

                console.log(users[i]);
                console.log(expenses);
                let totalExpense = 0;
                for(let j = 0 ;j<expenses.length ; j++){
                    totalExpense += expenses[j].eamount

                }
                console.log(totalExpense);
                let userObj = {
                    user:users[i],
                    expenses,
                    totalExpense
                }
                leaderboard.push(userObj);
            }
           return res.status(200).json({success : true, data : leaderboard});
        }

        return res.status(400).json({message : 'user is not premium user' });

    } catch (error) {
        res.status(500).json({success : false, data : error});
    }
}


exports.getLeaderBoardUser = async(req,res,next)=>{
    
    try{
        if(req.user.ispremiumuser){
            const userId = req.params.loadUserId;
            const user = await User.findOne({where:{id: userId}})
    
            const expenses = await user.getExpenses();
            return res.status(200).json({success:true , data: expenses })
        }

    }
    catch(error){
        return res.status(500).json({success : false, data : error});
    }
    

}




exports.getExpenses = async (req,res,next)=>{
   // const {eamount,edescription,category}= req.body;         
    let page = req.params.pageNo ||  1;
    console.log(page);
    console.log('---------------------------');
    let Items_Per_Page = +(req.body.Items_Per_Page)|| 5;
   
    console.log('************************************');
    console.log(Items_Per_Page);
    let totalItems;


   try
   {
      //  let data = await  req.user.getExpenses()
      //  res.status(200).json({data});
        let count = await Expense.count({where:{userId: req.user.id}})
        totalItems = count;

        let data = await req.user.getExpenses({offset: (page-1)*Items_Per_Page, limit: Items_Per_Page})
        ///console.log(data);
        res.status(200).json({
            data,
            info: {
            currentPage: page,
              hasNextPage: totalItems > page * Items_Per_Page,
              hasPreviousPage: page > 1,
              nextPage: +page + 1,
              previousPage: +page - 1,
              lastPage: Math.ceil(totalItems / Items_Per_Page),
            }
        })
        
   }
   catch(error){
    console.log(error);
    res.status(500).json({error:error});
   }

};


exports.addExpenses = async (req,res,next)=>{
    const {eamount,edescription,category}= req.body;
   
    try{

        if(!eamount || !edescription || !category){
            return res.status(400).json({message: 'no fields can be empty'})
        }
        const data = await req.user.createExpense({
            eamount,
            edescription,
            category
        })
        //magic funcs of seq for associations
        res.status(201).json({newExpenseDetail: data})

       // const eamount = req.body.eamount;
       // const edescription = req.body.edescription;
       // const category = req.body.category;

       /* const data = await Expense.create({
            eamount: eamount,
            edescription: edescription,
            category: category,
        })
        res.status(201).json({newExpenseDetail: data});*/
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
      }

};

exports.deleteExpenses = async (req,res,next)=>{
    try{
        let userId = req.params.userId;
        if(!userId)
        {
            res.status(400).json({error:'id missing'});
        }
        //await Expense.destroy({where:{id:userId}});
        //res.sendStatus(200);
        await req.user.getExpenses({where:{id:userId}}).then(expense=>{
            let findExpenses = expense[0];
            findExpenses.destroy();
            res.sendStatus(200);
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json('error occured');
      };

};



exports.downloadAllUrl = async(req,res,next) => {
    try {
        let urls = await req.user.getDownloadurls() ;
        if(!urls){
            res.status(404).json({ message:'no urls found with this user' , success: false});
        }
        res.status(200).json({ urls , success: true })
    } catch (error) {
        res.status(500).json({ err})
    }
}