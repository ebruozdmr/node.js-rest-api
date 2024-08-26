const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // for admin panel
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // date: {
    //   type: Date,
    //   default: new Date(),
    // },
  },
  //createdAt, updatedAt
  { timestamps: true }
);

module.exports = mongoose.model("Auth", AuthSchema);
