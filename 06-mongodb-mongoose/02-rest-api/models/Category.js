const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
},
{
  toJSON: {
    transform: function(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
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

module.exports = connection.model('Category', categorySchema);
