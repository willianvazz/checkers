Template.PeopleOnline.onCreated(function(){
	Meteor.subscribe('userStatus');
});

Template.PeopleOnline.helpers({
	onlineUsers(){
		//retrieving all users online but myself
		// return Meteor.users.find({ "status.online": true });
		return Meteor.users.find({ 
						"status.online": true, 
						_id: { $ne: Meteor.userId() },
		});
	}
});