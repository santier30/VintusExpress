const express = require('express')
const nodemailer = require('nodemailer');
const controlers = require('../controlers/usersControlers')
const Users = require('../schemas/User')

const validateMessage = (req , res , next) => {
    try {
        const {name,email,phone,message} = req.body
        if(message === "" || !message[19] || /[^0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑãõÃÕâêôÂÊÔàèìòùÀÈÌÒÙçÇ.,() '"°/-]/u.test(message) || /\s{2,}/.test(message)){throw new Error("menssage invalido")}
        if(name === "" || name.length < 3 || name.length > 30 || !/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+$/.test(name) || /\s{2,}/.test(name)){throw new Error("nombre invalido")}
        if(phone !== "" ) {if(!/^\+54\s?(11|15)\s?\d{8}$/.test(phone)){throw new Error("telefono invalido")}}
        if(email === "" || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/.test(email)){throw new Error("email invalido")}
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Fail sending message", err });
    }
    }
    const sendMessage = async (req , res)=>{
        const {name,email,phone,message} = req.body
        console.log(req.body)
    
        try {
         
            const transporter = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: 'VintusTm@gmail.com',
                    pass: 'orao eoqs ooji qibw',
                },
            });
    
            
            const corpMail = {
                from: 'VintusTm@gmail.com',
                to: 'VintusTm@gmail.com',
                subject: `mensaje de ${name}`,
                text: `
                    Email: ${email}
                    Phone: ${phone}
                    Message: ${message}
                `,
            };
    
            const clientMail = {
                from: 'VintusTm@gmail.com',
                to: email,
                subject: `Vintus servicio al cliente`,
                text: `
            Hola ${name} gracias por comunicarte con Vintus atencion al cliente
            su mensaje esta siendo prosesado y sera respondido a la brevedad.
    
            VintusTm
                `,
            }
    
          
            await transporter.sendMail(corpMail);
            await transporter.sendMail(clientMail);
    
            res.status(200).json({ message: "Data posted successfully", name });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Fail sending message", error: error.message });
        }
    
    }
    const singUp = async(req,res)=>{
        const data = req.body;
        console.log(data);
      try {
        const user = new Users(data);
        const response = await user.save();
        const userWithoutPassword = await Users.findById(response._id, { password: 0 })
        console.log(userWithoutPassword);
     
        res.status(200).json(userWithoutPassword);
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message);
      }
    
    
    }

    const logIn = async(req,res)=>{
        const data = req.body;
        console.log(data);
      try {
        const user = await Users.findOne(data,{ password: 0 },);
        console.log(user);
     if (user){res.status(200).json(user);}else{throw new Error("Email o contrasena incorrecta")}
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
      }
    
    
    }

    const check = async(req,res)=>{
        const data = req.body;
        console.log(data);
      try {
        const user = await Users.findOne(data,{ password: 0 },);
        console.log(user);
      if (user){res.status(200).json(user);}else{throw new Error("Email o contrasena incorrecta")}
      } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
      }
      
      
      }

      const update=async(req,res)=>{
        const data = req.body;
            console.log(data);
          try {
            const user = await Users.findOne({email:data.email,apiKey:data.apiKey},{ password: 0 });
            console.log(user);
            user.email=data.newEmail;
            user.name=data.name;
            user.dni=data.dni;
            user.sex=data.sex;
            user.birth=data.birth;
            user.phone=data.phone;
            user.apartment=data.apartment;
            const resp =  await user.save()
         if (resp){res.status(200).json(resp);}else{throw new Error("Email o contrasena incorrecta")}
          } catch (error) {
            console.log(error.message);
            res.status(500).json(error);
          }
    }

    const addAddress = async(req,res)=>{
        const data = req.body;
            console.log(data);
          try {
            const user = await Users.findOne({email:data.email,apiKey:data.apiKey},{ password: 0 });
            console.log(user);
            user.address=user.address[0]?[...user.address,data.address]:[data.address];
      
            const resp =  await user.save()
         if (resp){res.status(200).json(resp);}else{throw new Error("Email o contrasena incorrecta")}
          } catch (error) {
            console.log(error.message);
            res.status(500).json(error);
          }
      }

      const deleteAddress =  async(req, res) => {
        const apiKey = req.headers.authorization; 
        const email = req.headers['x-user-email']; 
        const addressId = req.params.addressId; 
      console.log(apiKey)
        try {
          const updatedUser = await Users.findOneAndUpdate(
            { email: email,apiKey: apiKey},
            { $pull: { address: { _id: addressId } } },
            { projection: { password: 0 },
              new: true 
            }
          ).exec();
        
          if (updatedUser) {
      
            console.log(updatedUser);
          } else {
      
            console.log("User or address not found");
          }
          res.status(200).json(updatedUser);
        } catch (error) {
         
          res.status(403).json({ message: 'Address deletion failed or unauthorized' });
        }
      }

      const changePassword = async(req,res)=>{
        const data = req.body;
            console.log(data);
          try {
            const user = await Users.findOne({email:data.email,apiKey:data.apiKey,password:data.password});
            console.log(user);
            user.password=data.newPassword;
            const resp =  await user.save()
            const userWithoutPassword = await Users.findById(resp._id, { password: 0 })
         if (userWithoutPassword){res.status(200).json(userWithoutPassword);}else{throw new Error("Email o contrasena incorrecta")}
          } catch (error) {
            console.log(error.message);
            res.status(500).json(error);
          }
      }

module.exports ={
    validateMessage,
    sendMessage,
    singUp,
    logIn,
    check,
    update,
    addAddress,
    deleteAddress,
    changePassword
}