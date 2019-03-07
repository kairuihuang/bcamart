console.log("hello!");
$(document).ready(function(){
	$.get("http://localhost:4000/loadVolunteers", (data, status) => {
		for (var i = 0; i < data.length; i++) {
			var email = data[i].email
			var firstName = data[i].firstName
			var hours = data[i].hours
			var lastName = data[i].lastName
			

			var row = "<tr><td><a href='http://localhost:4000/volunteers/" + i + "'>" + email +
					  "</a></td><td><a href='http://localhost:4000/volunteers/" + i + "'>" + firstName +
					  "</a></td><td><a href='http://localhost:4000/volunteers/" + i + "'>" + hours +
					  "</a></td><td><a href='http://localhost:4000/volunteers/" + i + "'>" + lastName +  "</a></td></tr>";
			
			$("tbody").append(row);
		}
	});
});