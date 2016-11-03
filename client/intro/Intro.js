import { Session } from 'meteor/session';

Template.Intro.onRendered(function(){
	Meteor.call('getUserInformation', function(error, result){
		if(error){
			//Error handling code
		}
		else {
			console.log(result);
			Session.set("mySecretToken", result);
		}
	});
});