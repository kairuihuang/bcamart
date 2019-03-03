$(document).ready(function(){
	
	const id = getMeta("id");
	const loadProductStr = "http://localhost:4000/loadProduct/" + id;

	$.get(loadProductStr, (data, status) => {
		console.log(data);
		const name = data.name;
		const cost = (data.cost).toFixed(2);
		const price = (data.price).toFixed(2);
		const margin = data.margin * 100;
		const markup = data.markup * 100;
		const quantity = data.quantity;
		const totalVal = data.totalValue.toFixed(2);
	});

});

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return 'not found';
}