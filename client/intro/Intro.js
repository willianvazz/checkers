import { Session } from 'meteor/session';

Template.Intro.onRendered(function(){
	Meteor.call('getUserInformation', function(error, result){
		if(error){
			//Error handling code
		}
		else {
			Session.set("mySecretToken", result);
		}
	});
});

Template.Intro.onCreated(function (){
	Meteor.subscribe('gameutil');
});

Template.Intro.helpers({
	// checking if a user has been challenged
	isChallenged(){
		try{
			return Meteor.user().challenger;
		}catch(err){
			return "";
		}
	},
	//check if the challenge has been accepted
	challengeAccepted(){
		try{
			return Meteor.user().matchStatus;
		}catch(err){
			return "";
		}
	},
	//redirect the user if challenge was accepted
	redirectGame(){
		//FlowRouter.redirect( '/game/'+ Meteor.user().challenger +"-vs-"+ Meteor.user().username );
	}
});

Template.Intro.events({
	'click .accept'(evt){
		var token = Session.get("mySecretToken"),
			challenger = Meteor.user().username,
			gameId = "";

		console.log("Challenger: ", Meteor.user().challenger);
		console.log("Me: ", Meteor.user().username);

		Meteor.call('game.init', Meteor.user().challenger, Meteor.user().username, token, function(error, result){
			gameId = result;
		});
		console.log('id: ', gameId);
		
		//letting the user that has challenged know that challenged was accepted
		Meteor.call('userMatch.update',  Meteor.user().challengerId, true, challenger, "", token);
		

		//redirecting the user to the game page
		//FlowRouter.redirect( '/game/'+ Meteor.user().username +"-vs-"+ Meteor.user().challenger );
	}
});