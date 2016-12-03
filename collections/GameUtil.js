import createToken from '../lib/token.js';
import generatePieces from '../lib/generatePieces.js';

GameUtil = new Mongo.Collection('gameutil');

//allowing users that are signed in to insert messages
GameUtil.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'game.init'(challenger, challenged, clientToken){
		//creating token in the server to compare with the one from the client
		var serverToken = createToken(this.connection);	
		var checkToken = clientToken.localeCompare(serverToken);

		//make sure the user is logged before adding a task
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		//if client and server token are the same insert the message
		if( checkToken == 0 ) {
			//inserting the information in the collection
			initialPieces = generatePieces(challenger, challenged);
			var id = GameUtil.insert({
				"createdAt": new Date(),
				"player1": challenger,
				"player2": challenged,
				"pieces": initialPieces,
				"result": null
			});

			return id;
		}
	},
});