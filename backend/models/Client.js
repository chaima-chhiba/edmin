const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const clientSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    unique: true,
  },
  idEdManager: {
    type: String,
  },
  idHubSpot: {
    type: String,
  },
  dbName: {
    type: String,
  },
  logo: {
    type: String,
  },
  schoolName: {
    type: String,
    required: true,
  },
  timeOfCreation: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
  schoolType: {
    type: String,
    enum: [ "jardinEnfant",
      "ecole",
      "college",
      "lycee",
      "collegeEtLycee",
      "primaireEtCollege",],
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  pack: {
     type: String,
    
  },
  legalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  headMaster: {
    type: String,
    required: true,
  },
  user: {
    userName: {
      type: String,
      required: true,
    },
    password: { 
      type: String,
      required: true,
    }
  }
});
clientSchema.pre('save', async function (next) {
  if (!this.isModified('user.password')) return next();
  this.user.password = await bcrypt.hash(this.user.password, 8);
  next();
});
clientSchema.pre("save", async function (next) {
  try {
  
    if (!this.isNew) {
      return next();
    }

   
    const count = (await Client.countDocuments({})) + 1; 
    const paddedCount = String(count).padStart(4, "0"); 
    this.serialNumber = `#CR-${paddedCount}`;

    next();
  } catch (error) {
    console.error("Error generating serial number:", error);
    next(error); 
  }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
