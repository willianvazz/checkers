var token = require('../lib/token.js');

Meteor.methods({
	'user.createChallenge'(challengedId, clientToken){
		//make sure the user is logged before adding a task
		if( !this.userId || !token.validateToken(clientToken, this.connection) ){
			throw new Meteor.Error('not-authorized');
		}

		var challenged = Meteor.users.findOne({ _id: challengedId});
		
		Meteor.users.update(challengedId, {
			$set: {
				challengerId: Meteor.userId(),
				challenger: Meteor.user().username,
				isChallenged: true
			}
		});

		Meteor.users.update(Meteor.userId(), {
			$set: {
				challengerId: challengedId,
				challenger: challenged.username,
			}
		});
	},

	'user.acceptChallenge'(clientToken){
		//make sure the user is logged before adding a task
		if( !this.userId || !token.validateToken(clientToken, this.connection) ){
			throw new Meteor.Error('not-authorized');
		}

		matchId = "1234";
		Meteor.users.update(Meteor.userId(), {
			$set: {
				matchStatus: true,
				matchId: matchId
			}
		});

		Meteor.users.update(Meteor.user().challengerId, {
			$set: {
				matchStatus: true,
				matchId: matchId
			}
		});
	},

	'user.clearChallenge'(userId, clientToken){
		//make sure the user is logged before adding a task
		if( !this.userId || !token.validateToken(clientToken, this.connection) ){
			throw new Meteor.Error('not-authorized');
		}

		Meteor.users.update(userId, {
			$set: {
				challengerId: null,
				challenger: null,
				matchStatus: null,
				matchId: null,
				isChallenged: false
			}
		});
	},
});