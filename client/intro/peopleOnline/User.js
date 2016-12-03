Template.User.events({
	'click .wrap-play'(evt){
		var token = Session.get("mySecretToken"),
				challengedId = evt.currentTarget.id;

		Meteor.call('user.createChallenge', challengedId, token);
	},
});