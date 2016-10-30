Template.Chat.onCreated(function (){
	Meteor.subscribe('chat');
});

Template.Chat.events({
	'submit .new-message'(event){
		//prevent defaut browser form submit
		event.preventDefault();

		//get value from the element
		const target = event.target;
		const text = target.text.value;

		//insert a message into the collection
		Meteor.call('message.insert', text);

		//clear the form
		target.text.value = '';
	},
});

Template.Chat.helpers({
	messages(){
		return Chat.find({});
	}
})