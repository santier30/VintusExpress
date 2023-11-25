const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    validate: {
      validator: (value)=> {
        return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+$/.test(value) && value.length >= 6 && value.length <= 25 && !/\s{2,}/.test(value);
      },
      message: 'El nombre fue invalido',
    },
  },
  email: {
    type: String,
    required: true, 
    validate: {
      validator: (value)=> {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/.test(value);
      },
      message: 'Email inválido.',
    },
  },
  password: {
    type: String,
    required: true, 
    validate: {
      validator:  (value)=> {
        return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value);
      },
      message: 'La contraseña fue invalida',
    },
  },
  address:{
    type: [
      {
        postalCode: {
          type: Number,
          required: true,
          validate: {
            validator: function(value) {
                return /^\d{4}$/.test(value);

            },
            message: 'Postal code must be a 4-digit number for the last object in the array.'
          }
        },
        street: {
          type: String,
          required: true
        },
        number: {
          type: Number,
          required: true
        },
        province: {
          type: String,
          required: true
        },
        apartment:String
      },]

},
  buys:{
    type:[{
      address:Object,
      cart:Array,
      price:Number,
      status:String,
      date:String,
      idT:String
    }]
  } ,
  dni:{
    type: Number,
    validate: {
      validator:  (value)=> {
        return (/^\d{7,8}$/.test(value));
      },
      message: 'dni invalido',
    },
  },
  sex:String,
  birth:Date,
  phone:{
    type: String,
    validate: {
      validator:  (value)=> {
        return value  ===""  || (/^\+54\s?(11|15)\s?\d{8}$/.test(value));
      },
      message: 'Numero de telefono invalido',
    },
  },
  cart:Array,
  apiKey:Number,
  admin:Boolean

}, {
  collection: 'Users',
});

userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified()) {
    // Generate a new apiKey if it's a new document or if any field is modified
    const sixDigitRandomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    this.apiKey = sixDigitRandomNumber;
  }
  next();
});

userSchema.pre('updateOne', function(next) {
  const sixDigitRandomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  this.update({}, { $set: { apiKey: sixDigitRandomNumber } });
  next();
});

module.exports = mongoose.model('Users', userSchema);
