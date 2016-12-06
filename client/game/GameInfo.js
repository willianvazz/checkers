import { Session } from 'meteor/session';

//allowing the client to have access to collection chat from the server
Template.GameInfo.onCreated(function (){
	Meteor.subscribe('gameChat', Meteor.user().matchId);
	Meteor.subscribe('game', Meteor.user().matchId);
});

Template.GameInfo.events({
	'submit .new-message'(event){
		var token = Session.get("mySecretToken");

		//prevent defaut browser form submit
		event.preventDefault();

		//get value from the element
		const target = event.target;
		const text = target.text.value;

		//insert a message into the collection with the secret token
		Meteor.call('game.insertMessage', Meteor.user().matchId, text, token);

		//clear the form
		target.text.value = '';
	},
});

Template.GameInfo.helpers({
	//method to send return all messages
	messages(){
		var gameId = Meteor.user().matchId;
		return GameChat.find({ gameId });
	},
	//method to check if it is his own message.
	ownMessage(usernameMessage){
		var user = Meteor.userId(),
			userMessage = usernameMessage.hash.username;

		if(userMessage == user){
			return true;
		}
	},
	player1Turn(){
		try{
			var game = Game.find().fetch()[0];
			if( (game.turn === Meteor.user().username) && (game.player1 === Meteor.user().username) ){
				console.log(game.pieces[3].fill);
				return  true;
			}else{
				return false;
			}
		}catch(err){}
	},
	player2Turn(){
		try{
			var game = Game.find().fetch()[0];
			if( (game.turn === Meteor.user().username) && (game.player2 === Meteor.user().username) ){
				return  true;
			}else{
				return false;
			}
		}catch(err){}
	},
	player1(){
		try{
			var game = Game.find().fetch()[0];
			if(Meteor.user()){
				return game.player1;
			}
		}catch(err){}
	},
	player2(){
		try{
			var game = Game.find().fetch()[0];
			if(Meteor.user()){
				return game.player2;
			}
		}catch(err){}
	},
	greenPieces(){
		var count = 0;
		try{
			var game = Game.find().fetch()[0];
			for( var i = 0; i < game.pieces.length; i++){
				// console.log(game.pieces[i].fill, count);
				// count++;
				if( (game.pieces[i].fill === "green") && (game.pieces[i].captured == true) ){
					count++;	
				}
			}
			return count;
		}catch(err){}
	},
	redPieces(){
		var count = 0;
		try{
			var game = Game.find().fetch()[0];
			for( var i = 0; i < game.pieces.length; i++){
				// console.log(game.pieces[i].fill, count);
				// count++;
				if( (game.pieces[i].fill === "red") && (game.pieces[i].captured == true) ){
					count++;	
				} 
			}
			return count;
		}catch(err){}
	}
});