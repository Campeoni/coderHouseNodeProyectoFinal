import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }, 
  idCart: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  },
  lastConnection: {
    type: Date,
    default: Date.now
  },
  documents: {
    type: [{
      name: {
        type: String,
      },
      reference: {
        type: String,
      }
    }]
  }
});

const userModel = model("users", userSchema);
export default userModel