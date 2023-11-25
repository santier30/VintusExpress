const express = require('express')
const nodemailer = require('nodemailer');
const controlers = require('../controlers/usersControlers')
const router = express.Router();
const Users = require('../schemas/User')
const {validateMessage,sendMessage,singUp,logIn,check,update,addAddress,deleteAddress,changePassword} = controlers



router.post('/Message',validateMessage, sendMessage)

router.post('/SingUp',singUp)

router.post('/Login',logIn)

router.post('/Check',check)

router.post('/Update',update)

router.post('/Cart',async(req,res)=>{
    const data = req.body;
        console.log(data.cart);
      try {
        const user = await Users.findOne({email:data.email,apiKey:data.apiKey},{ password: 0 });
        console.log(user);
        user.cart=data.cart;
        const resp =  await user.save()
     if (resp){res.status(200).json(resp);}else{throw new Error("Email o contrasena incorrecta")}
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
      }
})

router.post('/Address',addAddress)

router.delete('/Delete/:addressId', deleteAddress);
router.post('/Password',changePassword)






module.exports = router;

