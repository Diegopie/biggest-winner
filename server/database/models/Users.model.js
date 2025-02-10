import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  contests: [{
    type: Schema.Types.ObjectId,
    ref: 'Contests'
  }],
  contests_invitations: [{
    type: Schema.Types.ObjectId,
    ref: 'Contests'
  }],
})

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name || ""} ${this.last_name || ""}`.trim();
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (password) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel

