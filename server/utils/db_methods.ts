import * as Models from '../database/models/index.js'
import mongoose from 'mongoose';
import { UsersModel, ContestsModel } from '../database/models/index.ts';


// dbArray.push('friends', body.friend, body.user);
// (array, documentToUpdate, modifiedId)

interface UpdateDbResponse {
  success: boolean;
  msg?: string | Error;
}


interface UpdateDbArrayMethod<T> {
  (
    documentToUpdate: T,
    array_key: string,
    modifiedData: any,
    autosave?: boolean,    
    session?: mongoose.ClientSession | null
  ): Promise<UpdateDbResponse>;
}

interface UpdateDbArrayPullObject<T> {
  (
    documentToUpdate: T,
    array_key: string,
    obj_key: string,
    modifiedData: any,
    autosave?: boolean,
    session?: mongoose.ClientSession | null
  ): Promise<UpdateDbResponse>;
}

interface UpdateDbArray {
  response: (
    msg?: string | Error,
    didErr?: boolean | undefined
  ) => UpdateDbResponse;
  push: UpdateDbArrayMethod<mongoose.Document>;
  pull: UpdateDbArrayMethod<mongoose.Document>;
  pullObject: UpdateDbArrayPullObject<mongoose.Document>;
}

export const updateDbArray: UpdateDbArray = {
  response: (msg, didErr) => {
    if (didErr) {
      return { success: false, msg }
    }
    return { success: true }
  },
  push: async function (documentToUpdate, array_key, modifiedData, autosave = true, session = null) {
    try {
      const options = session ? { session } : {};

      await documentToUpdate.updateOne({
        $push: {
          [array_key]: modifiedData
        }
      }, options);

      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err: unknown) {
      console.error("On updateDBArray.push: ", err);
      if (err instanceof Error) {
        return this.response(err, true);
      } else {
        return this.response("An unknown error occurred", true);
      }
    }
  },
  pull: async function (documentToUpdate, array_key, modifiedData, autosave = true, session = null) {
    try {
      const options = session ? { session } : {};


      await documentToUpdate.updateOne({
        $pull: {
          [array_key]: modifiedData
        }
      }, options);

      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err) {
      console.error("On updateDBArray.pull: ", err);
      if (err instanceof Error) {
        return this.response(err, true);
      } else {
        return this.response("An unknown error occurred", true);
      }
    }
  },
  pullObject: async function (documentToUpdate, array_key, obj_key, modifiedData, autosave = true, session = null) {
    try {
      const options = session ? { session } : {};

      await documentToUpdate.updateOne({
        $pull: {
          [array_key]: {
            [obj_key]: modifiedData
          }
        }
      }, options)
      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err) {
      console.error("On updateDBArray.pullObject: ", err);
      if (err instanceof Error) {
        return this.response(err, true);
      } else {
        return this.response("An unknown error occurred", true);
      }
    }
  },
}


interface HandleContestUsers {
  response: (
    msg?: string | Error,
    didErr?: boolean | undefined
  ) => UpdateDbResponse;
  sendInvite: (
    user: UsersModel,
    contest: ContestsModel,
    role: "owner" | "admin" | "standard"
  ) => Promise<UpdateDbResponse>;
  handleInvite: (
    user: UsersModel,
    contest: ContestsModel,
    isAccepted: boolean
  ) => Promise<UpdateDbResponse>
}

export const handleContestUsers: HandleContestUsers = {
  response: (msg, didErr) => {
    if (didErr) {
      return { success: false, msg }
    }
    return { success: true, msg }
  },
  sendInvite: async function (user, contest, role) {
    try {
      const isAlreadyInvited = user.contests_invitations.find((invitations) => invitations.contest._id === contest._id);
      if (isAlreadyInvited) return this.response("user already invited", true)

      await updateDbArray.push(user, 'contests_invitations', contest._id);
      await updateDbArray.push(contest, 'user_invitations', { user: user._id, role });
      return this.response()

    } catch (err) {
      console.error("On handleContestUsers", err);
      if (err instanceof Error) {
        return this.response(err, true);
      } else {
        return this.response("An unknown error occurred", true);
      }
    }
  },
  handleInvite: async function (user, contest, isAccepted) {
    try {
      // Manage if invite was rescinded 
      const invitationData = contest.user_invitations.find((invitation) => invitation.user._id === user._id);
      if (!invitationData) return this.response("Invitation data not found", true);

      const session = await mongoose.startSession();
      session.startTransaction();

      if (isAccepted) {

        // Update User
        await Promise.all([
          await updateDbArray.pullObject(user, 'contests_invitations', 'contest', contest._id, false),
          await updateDbArray.push(user, 'contests', invitationData, false)
        ])
        await user.save();

        // Update Contest
        await Promise.all([
          await updateDbArray.pullObject(contest, 'user_invitations', 'user', user._id, false),
          await updateDbArray.push(contest, 'participants', invitationData, false)
        ])
        await contest.save();

        await session.commitTransaction();
        session.endSession();
        return this.response("Invite Accepted")
      }

      await Promise.all([
        await updateDbArray.pullObject(user, 'contests_invitations', 'contest', contest._id),
        await updateDbArray.pullObject(contest, 'user_invitations', "user", user._id)
      ])

      await session.commitTransaction();
      session.endSession();
      return this.response("Invite Declined")
    } catch (err) {
      console.error("On handleInvite", err);
      if (err instanceof Error) {
        return this.response(err, true);
      } else {
        return this.response("An unknown error occurred", true);
      }
    }
  },
  // TODO: rescind invites
}

const dbArray = {
  push: async (array, queryId, insertId) => {
    try {
      const user = await Models.UserModel.findByIdAndUpdate(
        { _id: queryId },
        { $addToSet: { [array]: insertId } },
        { new: true }
      );

      if (!user) {
        throw new Error('User does not exist.');
      }

      return user;
    } catch (err) {
      console.log(array + ' Arr Push Error: ', err);
      return false;
    }
  },
  pull: async (array, queryId, insertId) => {
    try {
      const user = await Models.UserModel.findByIdAndUpdate(
        { _id: queryId },
        { $pull: { [array]: insertId } },
        { new: true }
      );

      if (!user) {
        throw new Error('User does not exist.');
      }

      return user;
    } catch (err) {
      console.log(array + ' Arr Pull Error: ', err);
      return false;
    }
  },
  set: async (array, queryId, insertId) => {
    try {
      const user = await Models.UserModel.findByIdAndUpdate(
        { _id: queryId },
        { $set: { [array]: insertId } },
        { new: true }
      );
      // console.log(user);

      if (!user) {
        throw new Error('User does not exist.');
      }

      return user;
    } catch (err) {
      console.log(array + ' Arr Set Error: ', err);
      return false;
    }
  }
};
