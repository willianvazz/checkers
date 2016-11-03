import { Session } from 'meteor/session';

//allowing the client to have access to collection chat from the server
Template.Chat.onCreated(function (){
	Meteor.subscribe('chat');
});

Template.Chat.events({
	'submit .new-message'(event){
		var token = Session.get("mySecretToken");

		//prevent defaut browser form submit
		event.preventDefault();

		//get value from the element
		const target = event.target;
		const text = target.text.value;

		//insert a message into the collection with the secret token
		Meteor.call('message.insert', text, token);

		//clear the form
		target.text.value = '';
	},
});

Template.Chat.helpers({
	//method to send return all messages
	messages(){
		return Chat.find({});
	}
});