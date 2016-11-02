Meteor.methods({
	
	//method to get userInformation such as ip and user agent
	getUserInformation(){
		// var token = ;
		// check(token, String);

		return createToken(this.connection);
	},
	
});

function createToken(userInfo){
	if (userInfo){
		var ip 		  = userInfo.clientAddress,
			connId	  = userInfo.id,
			userAgent = userInfo.httpHeaders["user-agent"],
			token 	  = "";

		//converting to a number
		ip = ipToNumber(ip);
		//changing to base 14
		ip = baseConvert(ip, 10, 14);
		
		console.log("ip: ", ip);
		console.log("connId: ", connId);

		return "Hello";
	}
	return "No!";
}

function ipToNumber(ip){
	var numArray = ip.split('.');
	var number = 0;

	number = numArray[0] * Math.pow(256,3);
	number += numArray[1] * Math.pow(256,2);
	number += numArray[2] * 256;
	number += +numArray[3];
	
	return number;
}

function numberToIp(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

function baseConvert(n, from, to) {
	// numberVar.toString(radix) // to convert a number to desired base and use 
	// parseInt("string", inputBase)  // to convert a string of numbers from given base to decimal.
    return parseInt(n, from).toString(to);
}