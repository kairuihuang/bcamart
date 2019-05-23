$(document).ready(function(){
  const baseURL = 'http://localhost:4000/transactions/';
  $.get("/loadTransactions", (data, status) => {

		for (var info in data) {
			if (data[info] != null) {

				var timestamp = data[info].timestamp.formattedDate + " " + data[info].timestamp.formattedTime;
				var total = (data[info].netTotal).toFixed(2);
				var discount = (data[info].discount).toFixed(2);
				var volunteers = data[info].volunteers;

                console.log(volunteers);

                var volunteerStr = '';
                if (typeof volunteers  === 'string') {
                    volunteerStr = 'None';
                }
                else {
                    for (let i = 0; i < volunteers.length; i++) {
                        volunteerStr += volunteers[i].name;
                        if (i !== volunteers.length-1) { volunteerStr += ', '; }
                    }
                }

				const row = "<tr class = 'transactionRow' id='" + info + "'>\
						   <td class='text'><a>" + timestamp +
						  "</a></td><td class='number'><a>" + total +
						  "</a></td><td class='number'><a>" + discount +
						  "</a></td><td class='text'><a>" + volunteerStr;

				$("#transactionBody").append(row);
			}
		}
		$('.transactionRow').click((event) => {
			location = baseURL + event.currentTarget.id;
		})
		$('table').DataTable();
	});
});
