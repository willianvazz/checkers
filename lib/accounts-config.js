import { Accounts } from 'meteor/accounts-base';

//making sure this code only runs in the client
if(Meteor.isClient){
	//setting the account to use username instead of email.
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY',
	});
}