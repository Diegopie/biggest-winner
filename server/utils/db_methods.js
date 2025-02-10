import * as Models from '../database/models/index.js'


// dbArray.push('friends', body.friend, body.user);
// (array, documentToUpdate, modifiedId)

export const updateDbArray = {
  response: (msg, err) => {
    if (err) {
      return { success: false, msg }
    }
    return { success: true }
  },
  push: async function (array, documentToUpdate, modifiedData, autosave = true) {
    try {
      documentToUpdate[array].push(modifiedData);
      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err) {
      console.error("On updateDBArray.push: ", err);
      return this.response(err, true)
    }
  },
  pull: async function (array, documentToUpdate, modifiedData, autosave = true) {
    try {
      documentToUpdate[array] = documentToUpdate[array].filter(ids => ids !== modifiedData)
      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err) {
      console.error("On updateDBArray.pull: ", err);
      return this.response(err, true)
    }
  },
  pullObject: async function (array, key, documentToUpdate, modifiedData, autosave = true) {
    try {
      documentToUpdate[array] = documentToUpdate[array].filter(object => object[key]._id !== modifiedData)
      if (autosave) await documentToUpdate.save()

      return this.response()
    } catch (err) {
      console.error("On updateDBArray.pull: ", err);
      return this.response(err, true)
    }
  },
}

export const handleContestUsers = {
  response: (msg, err) => {
    if (err) {
      return { success: false, msg }
    }
    return { success: true }
  },
  sendInvite: async function (user, contest, role) {
    try {
      const isAlreadyInvited = user.contests_invitations.find((contest_id) => contest_id === contest._id);
      if (isAlreadyInvited) return this.response("user already invited", true)

      await updateDbArray.push('contests_invitations', user, contest._id);
      await updateDbArray.push('user_invitations', contest, {user: user._id, role});
      return this.response()

    } catch (err) {
      console.error("On handleContestUsers", err);
      return this.response(err, true)
    }
  },
  handleInvite: async function (user, contest, isAccepted) {
    try {
      if (isAccepted) {
        await updateDbArray.pull('contests_invitations', user, contest._id, false);
        await updateDbArray.push('contests', user, contest._id, false);
        user.save();
        
        const invitationData = contest.user_invitations.find((invitation) => invitation.user._id === user._id);
        await updateDbArray.pullObject('user_invitations', 'user', contest, user._id, false);
        await updateDbArray.push('participants', contest, invitationData, false);
        contest.save();
        return this.response("Invite Accepted")
      }

      await updateDbArray.pull('contests_invitations', user, contest._id,);
      await updateDbArray.pull('user_invitations', contest, user._id);

      return this.response("Invite Declined")
    } catch (err) {
      console.error("On handleInvite", err);
      return this.response(err, true)
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
