function calculate() {
  	alert("keyup");
 };

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
  		  var row = "<tr><td class = 'text'>" + $(this).children().first().text() + "</td><td>" + "<input type= 'text' class = 'cartinput' onkeyup= 'calculate()'>" + "</td><td class = 'number'>" + $(this).children().eq(2).text() + "<td><button type = 'button'>" + "Remove" + "</button></td>";
  		  var not_exists = true;
  		  for(i = 1; i < $("#cart tr").length; i++){
  		  	var l = $("#cart tr").get(i);
  			var v = $(l).children().first().text();
  			var e = $(this).children().first().text();
  			console.log(v);

  			if(v == $(this).children().first().text()){
  				not_exists = false;
  				console.log("got here");
  			}

  		  }
  		  if(not_exists)
  		  	$("#cart").append(row);
  	
  	});	
   });

  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
  
  $("#btn").on("click", function() {
  	var tbl = $("#cart tr");
  	console.log("here");
  	var total = 0;
  	if(tbl.length > 1){
  		for(i = 1; i < tbl.length; i++){
  			var l = tbl.get(i);
  			var q = ($(l).children().eq(1).children()[0].value);
  			var p = ($(l).children().eq(2).text())
  			total += (parseInt(q) * parseFloat(p));
  		}

  		console.log(total);
  		var volunteer = "anyone";
  		var date = new Date();
        var timestamp = date.getTime();
  		$.post("/finalizeTransaction", {'server[]': [total, volunteer, timestamp]});
  	}
  })
});

 

