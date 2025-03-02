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

const firstContest = await ContestsModel.insertOne({
  name: "New Contest",
  description: "This is a bunch of text",
  start_date: new Date("2025-04-25"),
  end_date: new Date("2025-06-25"),
  entry_fee: 20 * 100,
});


import { handleContestUsers } from '../../utils/db_methods.js';
console.log('--Send Invite--');

const secondUser = users[1];
const thirdUser = users[2];
const sendRes = await handleContestUsers.sendInvite(thirdUser, firstContest, 'admin');
await handleContestUsers.sendInvite(secondUser, firstContest, 'admin');

console.log(sendRes);

console.log(JSON.stringify(thirdUser, null, 4))
console.log(JSON.stringify(secondUser, null, 4))



console.log('--Accept Decline--');

await handleContestUsers.handleInvite(secondUser, firstContest, false)
await handleContestUsers.handleInvite(thirdUser, firstContest, true)



const queryContest = await ContestsModel.findById(firstContest._id).populate("participants.user", "first_name email username")

const contest_users = await UsersModel.find({
  contests: firstContest._id
})

console.log('contest');

console.log(JSON.stringify(queryContest, null, 4))
console.log("contest users");

console.log(JSON.stringify(contest_users, null, 4))

console.log('users');

console.log(JSON.stringify(thirdUser, null, 4))
console.log(JSON.stringify(secondUser, null, 4))

await db?.close()