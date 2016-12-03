import { Session } from 'meteor/session';

Template.Intro.onRendered(function(){
	Meteor.call('getUserInformation', function(error, result){
		if(error){
			//Error handling code
		}
		else {
			Session.set("mySecretToken", result);
			Meteor.call('user.clearChallenge', Meteor.userId(), result);
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
			return Meteor.user().isChallenged;
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
		FlowRouter.redirect( '/game/'+ Meteor.user().challenger +"-vs-"+ Meteor.user().username );
	}
});

Template.Intro.events({
	'click .accept'(evt){
		var token = Session.get("mySecretToken");

		Meteor.call('user.acceptChallenge', token);
	}
});