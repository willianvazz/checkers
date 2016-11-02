//when user logs in redirect to /intro
Accounts.onLogin(function(){
	FlowRouter.go('intro');
});

//when user logs out redirect to home
Accounts.onLogout(function(){
	FlowRouter.go('home');
});

//if the user is not logged in redirect to the homepage
FlowRouter.triggers.enter( [ function( context, redirect ){
	if(!Meteor.userId()){
		FlowRouter.go('home');
	}
} ] );

FlowRouter.route('/', {
	name: 'home',
	action(){
		//if the user is already logged in and access the homepage will be redirected to the intro
		if(Meteor.userId()){
			FlowRouter.go('intro');
		}
		BlazeLayout.render('HomeLayout');
	}
});

FlowRouter.route('/intro', {
	name: 'intro',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Intro'});
	}
});