Meteor.methods({
	//method to return the token to the client
	getUserInformation(){
		return createToken(this.connection);
	},
});

var createToken = function (userInfo){
	// console.log(userInfo);
	if (userInfo){
		var ip 		  = userInfo.clientAddress,
			userAgent = userInfo.httpHeaders["user-agent"],
			userId	  = Meteor.userId(),
			complex	  = "MeuJogoDeDamaRoxz", //random portuguese string to add complexity
			token 	  = "";

		//converting to a number
		ip = ipToNumber(ip);
		//changing to base 14
		ip = baseConvert(ip, 10, 14);
		//getting only the first 10 characteres from the string.
		userAgent = userAgent.substring(0,10);
		//applying rotation algorithm
		userAgent = rot(userAgent);

		//normalizing the strings to 17 characteres (which is the length of the userId)
		ip = normalizeStr(ip);
		userAgent = normalizeStr(userAgent);

		token = interleave(ip, userId, userAgent, complex);

		console.log("ip:        ", ip.length, " ", ip);
		console.log("UserId:    ", userId.length, " ", userId);
		console.log("UserAgent: ", userAgent.length, " ", userAgent);
		console.log("token: ", token.length, " ", token);

		return token;
	}
	return "No blah!";
}

//function to convert an ip to number
function ipToNumber(ip){
	var numArray = ip.split('.');
	var number = 0;

	number = numArray[0] * Math.pow(256,3);
	number += numArray[1] * Math.pow(256,2);
	number += numArray[2] * 256;
	number += +numArray[3];
	
	return number;
}

//function to convert a number to an ip
function numberToIp(int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

//function to convert a number from one base to another
function baseConvert(n, from, to) {
	// numberVar.toString(radix) // to convert a number to desired base and use 
	// parseInt("string", inputBase)  // to convert a string of numbers from given base to decimal.
    return parseInt(n, from).toString(to);
}

//function to rotate a string
function rot(myString){
	//source: https://stackoverflow.com/questions/617647/where-is-my-one-line-implementation-of-rot13-in-javascript-going-wrong
	return myString.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}

//function to normalize a string to the length 17
function normalizeStr(myString){
	for(var i = myString.length; i < 17; i++){
		myString += "0";
		
	}
	return myString;
}

// function to interleave 4 strings
function interleave(ip, userId, userAgent, complex){
	var token = "";

	for(var i = 0; i < ip.length; i++){
		token += ip[i];
		token += userId[i];
		token += userAgent[i];
		token += complex[i];
	}
	return token;
}


Meteor.checkers = { createToken: createToken };

// makeToken = createToken;




