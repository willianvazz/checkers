Template.Intro.onRendered(function(){
	Meteor.call('getUserInformation', function(error, result){
            if(error){
               //Error handling code
            }
            else {
				// var ip = result.clientAddress;
				// var userAgent = result.httpHeaders["user-agent"];
				
				// // var ipNumber = ipToNumber(ip);
				// // var numberIp = numberToIp(ipNumber);
				
				// console.log("ipNumber: ", ip);
				// console.log("ip: ", userAgent);

				console.log(result);
            }
	});
});