const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ \-'.]+$/.test(value) && !value.toLowerCase().includes("marca"),
      message: 'Invalid brand format',
    },
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value) && ["jpg", "jpeg", "png", "gif"].includes(value.split('.').pop().toLowerCase()),
      message: 'Invalid image format',
    },
  },
  long_description: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?"'-]*$/.test(value) && value.length >= 30,
      message: 'Invalid long_description format',
    },
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ \-'.]+$/.test(value) && value.length >= 3 && value.length <= 30,
      message: 'Invalid name format',
    },
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => !isNaN(value) && value >= 0,
      message: 'Invalid price format',
    },
  },
  short_description: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?"'-]*$/.test(value) && value.length >= 10,
      message: 'Invalid short_description format',
    },
  },
  stock: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => !isNaN(value) && value >= 0 && parseInt(value) === parseFloat(value),
      message: 'Invalid stock format',
    },
  },
  know:Boolean,
  exclusive:Boolean
}, {
  collection: 'Wines',
});

module.exports = mongoose.model('Wines', wineSchema);
