var token = require('../lib/token.js');
import createPieces from '../lib/game.js';

Game = new Mongo.Collection('game');

//allowing users that are signed in to insert messages
Game.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'game.updatePiece'(gameId, pieceId, cx, cy, clientToken){
		if( !this.userId || !token.validateToken(clientToken, this.connection) ){
			throw new Meteor.Error('not-authorized');
		}

		var game = Game.update({_id: gameId, "pieces.id": parseInt(pieceId) }, {
			$set: {
				"pieces.$.cx": cx,
				"pieces.$.cy": cy,
				turn: Meteor.user().challenger
			}
		});
	},
});

var createGame = function(challenger, challenged) {
	pieces = createPieces(challenger, challenged);
	var gameId = Game.insert({
		"createdAt": new Date(),
		"player1": challenger,
		"player2": challenged,
		"pieces": pieces,
		"turn": challenged,
		"result": null
	});

	return gameId;
};

module.exports = {
	createGame: createGame,
}