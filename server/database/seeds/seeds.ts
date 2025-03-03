import {
  UsersModel,
  EntryModel,
  ContestsModel
} from '../models/index.ts';

import {
  dummyUsers
} from './data.js';

import connectMongo from '../db.js';


const db = await connectMongo();
await UsersModel.deleteMany({});
await ContestsModel.deleteMany({});

const users = await UsersModel.insertMany(dummyUsers);

// const firstUser = users[0];

let firstContest: any = await ContestsModel.insertOne({
  name: "New Contest",
  description: "This is a bunch of text",
  start_date: new Date("2025-04-25"),
  end_date: new Date("2025-06-25"),
  entry_fee: 20 * 100,
  interval: 14
});


import { handleContestUsers } from '../../utils/db_methods.js';
console.log('--Send Invite--');

let secondUser: any = users[1];
let thirdUser: any = users[2];
const sendRes = await handleContestUsers.sendInvite(thirdUser, firstContest, 'owner');
await handleContestUsers.sendInvite(secondUser, firstContest, 'admin');

const queryContest_send = await ContestsModel.findById(firstContest._id).populate("participants.user", "first_name email username")

const contest_users_send = await UsersModel.find({
  "contest_invitations.contest":  firstContest._id 
})

console.log('--Accept Decline--');

firstContest = await ContestsModel.findById(firstContest._id)
secondUser = await UsersModel.findById(secondUser._id);
thirdUser = await UsersModel.findById(thirdUser._id);

await handleContestUsers.handleInvite(secondUser, firstContest, false)
await handleContestUsers.handleInvite(thirdUser, firstContest, true)



const queryContest = await ContestsModel.findById(firstContest._id).populate("participants.user", "first_name email username")

const contest_users = await UsersModel.find({
  "contests.contest": firstContest._id 
})

console.log(queryContest);

const newUser = await UsersModel.insertOne({
  first_name: "Dog",
  last_name: "Pie",
  username: "Pie",
  email: "password@password.com",
  password: "password",
})


import bcrypt from 'bcrypt';

bcrypt.compare('password', newUser.password, function(err, result) {
  // result == true
  console.log(result);
});

await db?.close()