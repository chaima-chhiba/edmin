const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Role = require('./Role');
const userSchema = new mongoose.Schema(
  {
    // Existing fields...
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [
        (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
      ],
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    avatar: {
      type: String,
    },
    addresses: [
      {
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      default: null,
    },
    status: {
      type: Boolean,
      default: true, // You can set the default status here
    },
  },
  {
    virtuals: {
      full_name: {
        get() {
          return this.first_name + ' ' + this.last_name;
        },
      },
      id: {
        get() {
          return this._id;
        },
      },
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
