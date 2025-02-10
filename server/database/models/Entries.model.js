import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EntriesSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
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

const EntryModel = mongoose.model('Entry', EntriesSchema);

export default EntryModel;