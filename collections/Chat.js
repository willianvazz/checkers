var token = require('../lib/token.js');

Chat = new Mongo.Collection('chat');

//allowing users that are signed in to insert messages
Chat.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'message.insert'(text, clientToken){
		//make sure the user is logged before adding a task
		if( !this.userId || !token.validateToken(clientToken) ){
			throw new Meteor.Error('not-authorized');
		}

		check(text, String);
		Chat.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});
	},
});




