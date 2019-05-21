$(document).ready(function(){
  const baseURL = 'http://localhost:4000/transactions/';
  $.get("/loadTransactions", (data, status) => {
  		
		for (var info in data) {
			if (data[info] != null) {

				var timestamp = data[info].timestamp.formattedDate + " " + data[info].timestamp.formattedTime;
				var total = data[info].netTotal;
				var discount = data[info].discount;
				var volunteer = data[info].volunteers;


				

				const row = "<tr class = 'transactionRow' id='" + info + "'>\
						   <td class='text'><a>" + timestamp +
						  "</a></td><td class='text'><a>" + total +
						  "</a></td><td class='text'><a>" + discount +
						  "</a></td><td class='text'><a>" +  volunteer;
				
				$("#transactionBody").append(row);
			}
		}
		$('.transactionRow').click((event) => {
			location = baseURL + event.currentTarget.id;
		})
		$('table').DataTable();
	});
});