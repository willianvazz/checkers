import '../lib/createToken.js';

GameUtil = new Mongo.Collection('gameutil');

//allowing users that are signed in to insert messages
GameUtil.allow({
	insert: function(userId, doc){
		return !!userId;
	}
});

Meteor.methods({
	'game.init'(challenger, challenged){
		
	},
});