$(document).ready(function(){

    var productList = [];
    var cart = [];

    $.get('/loadProducts', (data, status) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].isActive) {
                productList.push(data[i]);
            }
        }
        for (let i = 0; i < productList.length; i++) {
            let html = "<button type='secondary' class='btn btn-secondary item'\
                                id='" + productList[i].id + "'>" + productList[i].name;
            $('#pGroup').append(html);
        }

        // event handler when product buttons are clicked
        $('.item').click((event) => {
            let id = Number(event.currentTarget.id);
            let pos = isInCart(cart, id);

            // if not in cart yet
            if (pos === -1) {
                let info = searchProductByID(productList, id);
                if (info !== -1) {
                    let obj = {
                        id: info.id,
                        name: info.name,
                        price: info.price,
                        quantity: 1,
                        subtotal: info.price
                    }
                    cart.push(obj);
                    let row = "<tr class='productRow' id='" + obj.id + "'>\
						<td class='text-left name'>" + obj.name + "</td>\
						<td class='text-right price'>" + obj.price.toFixed(2) + "</td>\
						<td class='text-right quantity'>" + obj.quantity + "</td>\
						<td class='text-right subtotal'>" + obj.subtotal.toFixed(2) + "</td>\
					</tr>";
                    $('#cartBody').append(row);
                }
                else { console.log('product not found'); }
            }
            // update quantity and subtotal of exisiting row
            else {
                cart[pos].quantity += 1;
                cart[pos].subtotal = cart[pos].quantity * cart[pos].price;
                $('#' + id + ' .quantity').text(cart[pos].quantity);
                $('#' + id + ' .subtotal').text(cart[pos].subtotal);
            }
        })

    })
});

// returns -1 if not found, else returns item index in cart
function isInCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id)
            return i;
    }
    return -1;
}

// returns -1 if not found, else returns product object
function searchProductByID(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return list[i];
        }
    }
    return -1;
}
