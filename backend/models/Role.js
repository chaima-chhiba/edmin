const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    accessList: {
      Users: {
        type: Boolean,
        default: false,
      },
      Roles: {
        type: Boolean,
        default: false,
      },
      Customers: {
        type: Boolean,
        default: false,
      },
      Feedbacks: {
        type: Boolean,
        default: false,
      },
      Statistique: {
        type: Boolean,
        default: false,
      },
      Packs: {
        type: Boolean,
        default: false,
      },
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
