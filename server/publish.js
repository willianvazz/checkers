// This code only runs on the server
// Only publish to the client
Meteor.publish('chat', function(){
	return Chat.find( {} );
});