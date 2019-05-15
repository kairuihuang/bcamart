$(document).ready(function(){
  $.get("/loadTransactions", (data, status) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i] != null) {
				var id = data[i].id;
				var items = data[i].items;
				var timestamp = data[i].timestamp;
				var total = data[i].total;
				var volunteer = data[i].volunteer;


				

				const row = "<tr><td class='text'><a>" + id +
						  "</a></td><td class='text'><a>" + items +
						  "</a></td><td class='text'><a>" + timestamp +
						  "</a></td><td class='text'><a>" + total +
						  "</a></td><td class='text'><a>" + volunteer;
				
				$("#myTable").append(row);
			}
		}
	});
});