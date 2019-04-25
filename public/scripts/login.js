$(document).ready(function() {
});

function login(){
	var login = document.getElementById("user").value;
	var password = document.getElementById("pw").value;
	if((login != null) && (password != null)){
		$.post("/loginAuth", {'server[]': [login, password]});
		console.log("got here")
	}

}