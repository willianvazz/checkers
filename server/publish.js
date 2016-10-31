// This code only runs on the server
// Only publish the chat messages to the client
Meteor.publish('chat', function(){
	return Chat.find( {} );
});

//Publishing which users are online
Meteor.publish('userStatus', function() {
 	return Meteor.users.find({ "status.online": true });
});