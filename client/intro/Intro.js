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
		console.log('username Redirect Meteor: ', Meteor.user().username);
		console.log('username Redirect Challenger: ', Meteor.user().challenger);
		FlowRouter.redirect( '/game/'+ Meteor.user().challenger +"-vs-"+ Meteor.user().username );
	}
});

Template.Intro.events({
	'click .accept'(evt){
		var token = Session.get("mySecretToken"),
			challenger = Meteor.user().username;
		
		Meteor.call( 'userMatch.update',  Meteor.user().challengerId, true, challenger, "", token );
		FlowRouter.redirect( '/game/'+ Meteor.user().username +"-vs-"+ Meteor.user().challenger );
	}
});