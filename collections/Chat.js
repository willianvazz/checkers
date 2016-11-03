import '../lib/createToken.js';

Chat = new Mongo.Collection('chat');

//allowing users that are signed in to insert messages
Chat.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'message.insert'(text, clientToken){
		var serverToken = makeToken;	
		console.log("servertoken: ", serverToken);

		check(text, String);
		//make sure the user is logged before adding a task
		if( ! this.userId){
			throw new Meteor.Error('not-authorized');
		}

		//inserting the message in the collection
		Chat.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});
	},
});
