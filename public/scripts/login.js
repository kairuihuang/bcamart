$(document).ready(function() {
});

function login(callback){
	var login2 = "" + document.getElementById("user").value;
	var password2 = "" + document.getElementById("pw").value;
	if((login2 != null) && (password2 != null)){
		$.post("/loginAuth", { "server[]": [login2 , password2] }).done(function( data ) {
			window.location.assign(""+data);
		});
	}
}