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
	isChallenged(){
		if(Meteor.user().challenger){
			return Meteor.user().challenger;
		}else{
			return "";
		}
	},
	challengeAccepted(){
		return Meteor.user().challengerId;
	},
	redirectGame(){
		console.log('username: ', Meteor.user().username);
		console.log('username: ', Meteor.user().challenger);
		//FlowRouter.redirect( '/game/'+ Meteor.user().username +"-vs-"+ Meteor.user().challenger );
	}
});

Template.Intro.events({
	'click .accept'(evt){
		var token = Session.get("mySecretToken");
		console.log("matchStatus: ", Meteor.user().matchStatus);
		Meteor.call( 'userMatch.update',  Meteor.user().challengerId, true, "", "", token );
		console.log("matchStatus: ", Meteor.user().matchStatus);
		//FlowRouter.redirect( '/game/'+ Meteor.user().username +"-vs-"+ Meteor.user().challenger );
	}
});