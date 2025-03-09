import mongoose from "mongoose";
const Schema = mongoose.Schema;
import UsersModel from "./Users.model.ts";
import type EntriesModel from "./Entries.model.ts";

interface ContestsModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  interval: number;
  entry_fee: number;
  reward_pool: number;
  muscle_mass_winner?: UsersModel;
  weight_loss_winner?: UsersModel;
  participants: [{
    user: UsersModel;
    joinedDate: Date;
    payment_status: "pending" | "paid" | "approved";
    role: "owner" | "admin" | "standard";
  }];
  user_invitations: [{
    user: UsersModel;
    role: "owner" | "admin" | "standard";
  }];
  intervals: [{
    interval_number: number,
    start_date: Date;
    end_date: Date;
    entries?: [EntriesModel]
  }]
}

const ContestsSchema = new Schema<ContestsModel>({
  name: {
    type: String,
    required: true
  },
  description: String,
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  interval: {
    type: Number,
    required: true
  },
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
    ref: 'Users'
  },
  weight_loss_winner: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
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
      enum: ["owner", "admin", "standard"],
      default: 'standard'
    }
  }],
  user_invitations: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    role: { // Role within this specific contest
      type: String,
      enum: ["owner", "admin", "standard"],
      default: 'standard'
    }
  }],
  intervals: [{
    interval_number: {
      type: Number,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    entries: [{
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: false
    }]
  }]
})

ContestsSchema.pre('save', async function (next) {
  interface Interval {
    interval_number: number;
    start_date: Date;
    end_date: Date;
  }

  function createIntervals(
    prevDate: Date,
    currentDate: Date,
    endDate: Date,
    interval: number,
    intervals: Interval[] = [] // Inline type definition
  ) {
    
    if (currentDate >= endDate) {
      return intervals;
    }

    // function inits with startDate
    if (currentDate.toISOString() === prevDate.toISOString()) {
      prevDate = new Date(currentDate.setUTCDate(currentDate.getUTCDate()))
      currentDate = new Date(currentDate.setUTCDate(currentDate.getUTCDate() + interval))
      return createIntervals(prevDate, currentDate, endDate, interval)
    }

    const newInterval: Interval = {
      interval_number: intervals.length,
      start_date: new Date(prevDate.toISOString().slice(0, 10)),
      end_date: new Date(currentDate.toISOString().slice(0, 10)),
    }

    prevDate = new Date(currentDate);
    currentDate = new Date(currentDate.setUTCDate(currentDate.getUTCDate() + interval))
    return createIntervals(prevDate, currentDate, endDate, interval, [...intervals, newInterval])
  }

  const intervals: Interval[] = createIntervals(
    new Date(this.start_date),
    new Date(this.start_date),
    new Date(this.end_date),
    this.interval
  )

  if (intervals.length <= 0) {
    next();
  }
  
  console.log(intervals);
  this.intervals = intervals;

  next();

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

const ContestsModel = mongoose.model<ContestsModel>('Contests', ContestsSchema);

export default ContestsModel;