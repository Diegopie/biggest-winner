import {
  UserModel,
  EntryModel,
  ContestsModel
} from '../models/index.js';

import {
  dummyUsers
} from './data.js';

import connectMongo from '../db.js';


const db = await connectMongo();
await UserModel.deleteMany({});
await ContestsModel.deleteMany({});

const users = await UserModel.insertMany(dummyUsers);

const firstUser = users[0]

const firstContest = await ContestsModel.insertOne({
  name: "New Contest",
  description: "This is a bunch of text",
  start_date: new Date("2025-04-25"),
  end_date: new Date("2025-06-25"),
  entry_fee: 20 * 100,
  participants: [{
    user: firstUser._id,
    role: "owner"
  }]
})

// firstUser.contests.push(firstContest._id);
const obj = {
  array: 'contests',
  documentToUpdate: firstUser,
  documentToAdd: firstContest
}

const refactor = obj.documentToUpdate[obj.array].push(obj.documentToAdd._id)

const secondUser = users[1];
const isParticipant = firstContest.participants.some(p => p.user.equals(secondUser._id));
if (isParticipant) console.log("User already in contest");
// return res.status(400).json({ message: "User already in contest" });

const req = { role: "admin" }

firstContest.participants.push({
  user: secondUser._id,
  role: req.role
});









// Invite User 3
import { handleContestUsers } from '../../utils/db_methods.js';
console.log('--Send Invite--');
const thirdUser = users[2];
const sendRes = await handleContestUsers.sendInvite(thirdUser, firstContest, 'admin');
const fourthUser = users[3];
await handleContestUsers.sendInvite(fourthUser, firstContest, 'admin');


console.log('--Accept Decline--');

await handleContestUsers.handleInvite(thirdUser, firstContest, true)
await handleContestUsers.handleInvite(fourthUser, firstContest, false)



const queryContest = await ContestsModel.findById(firstContest._id).populate("participants.user", "first_name email username")

const contest_users = await UserModel.find({
  contests: firstContest._id
})


console.log(JSON.stringify(thirdUser, null, 4))
console.log(JSON.stringify(fourthUser, null, 4))

await db?.close()