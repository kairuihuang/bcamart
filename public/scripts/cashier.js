$(document).ready(function(){

    var productList = [];

    $.get('/loadProducts', (data, status) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].isActive) {
                productList.push(data[i]);
            }
        }
    })
});
