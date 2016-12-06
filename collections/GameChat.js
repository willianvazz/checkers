var token = require('../lib/token.js');

GameChat = new Mongo.Collection('gameChat');

//allowing users that are signed in to insert messages
GameChat.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'game.insertMessage'(gameId, text, clientToken){
		//make sure the user is logged before adding a task
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		if (token.validateToken(clientToken, this.connection)){
			check(text, String);
			GameChat.insert({
				text,
				gameId: gameId,
				createdAt: new Date(),
				owner: this.userId,
				username: Meteor.users.findOne(this.userId).username,
			});
		}
	},
});