import { Session } from 'meteor/session';

Template.Intro.onRendered(function(){
	
});

Template.Intro.onCreated(function (){
	
});

Template.Intro.helpers({
	clearInfo(){
		Meteor.call('getUserInformation', function(error, result){
			if(error){
				//Error handling code
			}
			else {
				Session.set("mySecretToken", result);
				Meteor.call('user.clearChallenge', Meteor.userId(), result);
				
			}
		});
	},
	challenger(){
		if(Meteor.user()){
			return Meteor.user().challenger;
		}
	},
	// checking if a user has been challenged
	isChallenged(){
		if(Meteor.user()){
			return Meteor.user().isChallenged;
		}
	},
	//check if the challenge has been accepted
	challengeAccepted(){
		if (Meteor.user()){
			return Meteor.user().matchStatus;
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
	},
	'click .deny'(evt){
		var token = Session.get("mySecretToken");

		Meteor.call('user.clearChallenge', Meteor.userId(), token);
	}
});