import mongoose from "mongoose";
const Schema = mongoose.Schema;
import UserModel from "./Users.model.js";

const ContestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  start_date: Date,
  end_date: Date,
  entry_fee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reward_pool: {
    type: Number,
    default: 0,
    min: 0,
  },
  muscle_mass_winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  weight_loss_winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedDate: { type: Date, default: Date.now },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "approved"],
      default: "pending"
    },
    role: { // Role within this specific contest
      type: String,
      enum: ["owner", "admin", "viewer"],
      default: 'viewer'
    }
  }],
  user_invitations: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: { // Role within this specific contest
      type: String,
      enum: ["owner", "admin", "viewer"],
      default: 'viewer'
    }
  }]
})

// * This could have worked for making two way updates but now we have to deal with requests
// ContestSchema.post('save', async function(doc) {
//   console.log('post');
//   // Loop through participants to add the contest to the users' contests array
//   if (this.isModified('name') || this.isModified('description') || this.isModified('start_date') || this.isModified('end_date') || this.isModified('entry_fee') || this.isModified('reward_pool')  || this.isModified('entry_fee') || this.isModified('reward_pool') || this.isModified('weight_loss_winner') || this.isModified('muscle_mass_winner')) return;

//   console.log("plz");

//   const allUsers = await Promise.all(doc.participants.map(participants => {
//     return UserModel.findById(participants.user._id);
//   }))

//   for (const user of allUsers) {
//     if (user) {
//       // Ensure the user has this contest in their contests array
//       if (!user.contests.includes(doc._id)) {
//         user.contests.push(doc._id);
//         await user.save();
//         break;
//       }
//     }
//   }
// });

const ContestsModel = mongoose.model('Contests', ContestSchema);

export default ContestsModel;