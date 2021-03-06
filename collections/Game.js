import createPieces from '../lib/game.js';

var token = require('../lib/token.js');

Game = new Mongo.Collection('game');

//allowing users that are signed in to insert messages
Game.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'game.updatePiece'(gameId, piecePos, cx, cy, clientToken){
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		if (token.validateToken(clientToken, this.connection)){
			Game.update({_id: gameId, "pieces.data-pos": parseInt(piecePos) }, {
				$set: {
					"pieces.$.cx": cx,
					"pieces.$.cy": cy,
					turn: Meteor.user().challenger
				}
			});
		}
	},
	'game.capturePiece'(gameId, piecePos, clientToken){
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		if (token.validateToken(clientToken, this.connection)){
			var game = Game.update({_id: gameId, "pieces.data-pos": parseInt(piecePos) }, {
				$set: {
					"pieces.$.captured": true
				}
			});
		}
	},
	'game.becomeCrown'(gameId, piecePos, clientToken){
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		if (token.validateToken(clientToken, this.connection)){
			var game = Game.update({_id: gameId, "pieces.data-pos": parseInt(piecePos) }, {
				$set: {
					"pieces.$.crown": true
				}
			});
		}
	},
	'game.quit'(gameId, clientToken){
		if( !this.userId ){
			throw new Meteor.Error('not-authorized');
		}

		if (token.validateToken(clientToken, this.connection)){
			Game.update({_id: gameId}, {
				$set: {
					quit: true
				}
			});
		}
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
		"result": null,
		"quit": false
	});

	return gameId;
};

module.exports = {
	createGame: createGame,
}