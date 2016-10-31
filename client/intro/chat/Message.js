Template.Message.helpers({
	//method to check if it is his own message.
	ownMessage(usernameMessage){
		var user = Meteor.userId(),
			userMessage = usernameMessage.hash.username;

		if(userMessage == user){
			return true;
		}
	}
});