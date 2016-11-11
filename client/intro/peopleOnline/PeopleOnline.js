Template.PeopleOnline.onCreated(function(){
	Meteor.subscribe('userStatus');
});

Template.PeopleOnline.helpers({
	onlineUsers(){
		//retrieving users online
		return Meteor.users.find({ "status.online": true });
	}
});