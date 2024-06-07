const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  code:  String,
  name: String,
  email: String,
  penalty: {
    type: String,
    default: 'n'
  }
});

module.exports = mongoose.model('Member', memberSchema);
