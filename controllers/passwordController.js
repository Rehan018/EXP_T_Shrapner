const User = require('../models/user')
const Forgotpassword = require('../models/forgotPassword');



const bcrypt = require('bcrypt');

const uuid = require('uuid');

const sib = require('sib-api-v3-sdk');

require('dotenv').config();

exports.Forgotpassword = async(req,res,next)=>{
    const {email} =req.body ;

    const user = await User.findOne({where:{email}});

    const id = uuid.v4();

    console.log(id);

    user.createForgotpassword({id,active:true}).catch(err=>{ throw new Error(err)})

    console.log('into forgot');

    console.log(email);

    const client = sib.ApiClient.instance

    const apiKey = client.authentications['api-key']

    apiKey.apiKey = process.env.API_KEY


    const tranEmailApi = new sib.TransactionalEmailsApi()


   

    
    const sender = {
        email : 'hrithikgowda060@gmail.com',
        name : 'Mr.Hrithik'
    }

    
    
    const recievers = [
        {
            email : email,
        },
    ]
    console.log(recievers);

    console.log('******************************');

    tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: 'forgotpass please reset',
        textContent: `Follow the link and reset password`,
        htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:5000/pass/reset/${id}">Reset password</a>`,

    }).then((response)=>{
        //console.log('after transaction');
        return res.status(202).json({sucess: true, message: "password mail sent Successful"});
    }).catch(err=>console.log(err))
    

}

exports.resetPassword = async (req,res,next)=>{
    console.log('into reset');
    let  id = req.params.id ;

    try {
        let forgotpasswordrequest = await Forgotpassword.findOne({where:{id}})
        if(!forgotpasswordrequest){
            return res.status(404).json('User doesnt exist')
        }
        forgotpasswordrequest.update({ active:false });
      
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/pass/update/${id}" method="POST">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end();
    } catch (err) {
        return res.status(500).json({ message: err});
    }


}


exports.updatePassword = async(req,res,next)=>{
    console.log('into update');
    const { newpassword } = req.query;
    const id = req.params.resetpasswordid;

   // const token = localStorage.getItem('token')

    console.log(typeof(newpassword) ) 
    try {
        const resetpasswordrequest  = await Forgotpassword.findOne({where:{id}})
        const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
        if(!user){
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

        const saltRounds = 10;
        bcrypt.hash(newpassword, saltRounds, async(err, hash)=>{
            if(err){
                throw new Error(err);
            }
            await user.update({ password:hash })
            res.status(201).json({message: 'Successfuly update the new password'})
        });
        

    } catch (error) {
        return res.status(403).json({ error, success: false } )
    }
}


