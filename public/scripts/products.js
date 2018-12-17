console.log("hello!");
$(document).ready(function(){
	$.get("http://localhost:4000/loadProducts", (data, status) => {
		alert("get request sent");
		console.log(data);
	});
});