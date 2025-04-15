const mongoose = require("mongoose");
const Client = require('./Client');
const SMShistorySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,  
    required: true,
    ref: 'Client'  
  },
  amountAdded: {
    type: Number,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
  oldBalance: {
    type: String,
    required: true
  },
  newSolde: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
});

const SMShistory = mongoose.model("SMShistory", SMShistorySchema);

module.exports = SMShistory;
