import mongoose from "mongoose";
import type UsersModel from "./Users.model";
import type ContestsModel from "./Contests.model";
const Schema = mongoose.Schema;

interface EntriesModel extends mongoose.Document {
  user: UsersModel;
  contest: ContestsModel;
  date: Date;
  weight: Number;
  bmi: Number;
  denomination: "Lbs" |"Kilo"
}

const EntriesSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contests' },
  date: {
    type: Date,
    default: Date.now
  },
  weight: Number,
  bmi: Number,
  denomination: {
    type: String,
    enum: ["Lbs", "Kilo"],
    default: "Lbs"
  }
}, { timestamps: true })


// filthy gpt pasta
// EntriesSchema.pre('save', function(this: EntriesModel, next) {
//   const currentDate = new Date();
//   const entryDate = this.date;
//   const timeDiff = Math.abs(currentDate.getTime() - entryDate.getTime());
//   const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

//   if (diffDays > 1) {
//     return next(new Error("Cannot save an entry that is more than a day old."));
//   }

//   next();
// });

const EntriesModel = mongoose.model('Entries', EntriesSchema);

export default EntriesModel;