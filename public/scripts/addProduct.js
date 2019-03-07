$(document).ready(function() {
	console.log("script loaded");
	// data validation time!
	$(".addProductForm").addEventListener("submit", validateAddProduct);
});

function validateAddProduct () {

}

function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
}