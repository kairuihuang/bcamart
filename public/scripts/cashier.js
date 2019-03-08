$(document).ready(function(){
  $.get("/loadProducts", (data, status) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i] != null) {
				var id = data[i].id;
				var name = data[i].name;
				var cost = data[i].cost;
				var price = data[i].price;
				var quantity = data[i].quantity;

				cost = cost.toFixed(2);
				price = price.toFixed(2);

				

				const row = "<tr><td class='text'><a>" + name +
						  "</a></td><td class='number'><a>" + cost +
						  "</a></td><td class='number'><a>" + price +
						  "</a></td><td class='number'><a>" + quantity;
				
				$("#myTable").append(row);
			}
		}
	}).always(function(){
		$("tbody tr").on("click", function(){
  		  var row = "<tr><td class = 'text'>" + $(this).children().first().text() + "</td><td>" + "<input type= 'text'>" + "</td><td class = 'number'>" + $(this).children().eq(2).text();
  		  $("#cart").append(row);
  	  });
});

  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});



