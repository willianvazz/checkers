Meteor.methods({
	'userMatch.update'(id, matchStatus, challenger, challengerId, clientToken){
		Meteor.users.update(id, {
			$set: { challenger: challenger }
		});
		Meteor.users.update(id, {
			$set: { challengerId: challengerId }
		});
		Meteor.users.update(id, {
			$set: { matchStatus: matchStatus }
		});
	},
});