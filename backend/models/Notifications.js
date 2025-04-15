
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  client: { type: [String], required: true },  
  topic: { type: [String], required: true }, 
  audience: { type: String, required: true },  
  screen: { type: String, default: '' },       
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
