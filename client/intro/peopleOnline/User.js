Template.User.onRendered(function(){
	//everytime the template loads clear matching info
	var token = Session.get("mySecretToken");
	// console.log('myUser: ', Meteor.user());
	Meteor.call( 'userMatch.update', Meteor.userId(), false, "", "", token );
});

Template.User.events({
	'click .wrap-play'(evt){
		var token = Session.get("mySecretToken"),
			challenged = evt.currentTarget.id,
			challenger = Meteor.user().username,
			challengerId = Meteor.userId();

		console.log('events: ', Meteor.user());
		console.log('challengerId: ', challengerId);

		//if user clicked on another user to play against, update user's document
		Meteor.call( 'userMatch.update', challenged, true, challenger, challengerId, token );
	},
});