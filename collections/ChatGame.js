import '../lib/createToken.js';

GameChat = new Mongo.Collection('gamechat');

//allowing users that are signed in to insert messages
GameChat.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'gameChatMessage.insert'(text, clientToken){
		//creating token in the server to compare with the one from the client
		var serverToken = Meteor.checkers.createToken(this.connection);	
		var checkToken = clientToken.localeCompare(serverToken);

		//make sure the user is logged before adding a task
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		//if client and server token are the same insert the message
		if( checkToken == 0 ) {
			//inserting the message in the collection
			check(text, String);
			GameChat.insert({
				text,
				createdAt: new Date(),
				owner: this.userId,
				username: Meteor.users.findOne(this.userId).username,
			});
		}
	},
});