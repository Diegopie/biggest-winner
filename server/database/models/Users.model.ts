import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import ContestsModel from "./Contests.model.ts"

const Schema = mongoose.Schema;

interface UsersModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  contests: [{
    contest: ContestsModel,
    role: "owner" | "admin" | "standard"
  }];
  contest_invitations: [{
    contest: ContestsModel,
    role: "owner" | "admin" | "standard"
  }];
  full_name: string;
  isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UsersModel>({
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
    contest: {
      type: Schema.Types.ObjectId,
      ref: 'Contests'
    },
    role: {
      type: String,
      enum: ["owner", "admin", "standard"]
    }
  }],
  contest_invitations: [{
    contest: {
      type: Schema.Types.ObjectId,
      ref: 'Contests'
    },
    role: {
      type: String,
      enum: ["owner", "admin", "standard"]
    }
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
  } catch (error: any) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (password: string) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const UsersModel = mongoose.model<UsersModel>('Users', UserSchema);

export default UsersModel

