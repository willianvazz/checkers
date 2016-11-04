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
			Chat.insert({
				text,
				createdAt: new Date(),
				owner: this.userId,
				username: Meteor.users.findOne(this.userId).username,
			});
		}
	},
});




