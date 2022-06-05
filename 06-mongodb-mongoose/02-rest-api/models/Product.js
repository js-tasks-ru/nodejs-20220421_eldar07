const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  images: [String],
},
{
  versionKey: false,
  toJSON: {
    transform: function(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
});

module.exports = connection.model('Product', productSchema);
