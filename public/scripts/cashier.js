// global variables
var productList = [];
var cart = [];
var totalPrice = 0;

$(document).ready(function(){

    $.get('/loadProducts', (data, status) => {
        loadProductBtns(data);
        console.log(productList);

        // event handler when product buttons are clicked
        $('.item').click((event) => {
            let id = Number(event.currentTarget.id);
            let pos = isInCart(cart, id);

            // if not in cart yet
            if (pos === -1) {
                let info = searchProductByID(productList, id);
                if (info !== -1) { addToCart(info); }
                else { console.log('product not found'); }
            }
            // update quantity and subtotal of exisiting row
            else { updateCart(id, pos); }
        });

        $('#cashBtn').click((event) => {
            // if empty don't cash
            if (cart.length === 0) {
                alert('cart is null, can\'t cash');
                event.preventDefault();
            }
        })

    });
});

// returns -1 if not found, else returns item index in cart
function isInCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id)
            return i;
    }
    return -1;
}

function addToCart(info) {
    let obj = {
        id: info.id,
        name: info.name,
        price: info.price,
        quantity: 1,
        subtotal: info.price
    }
    cart.push(obj);
    let row = "<tr class='productRow' id='" + obj.id + "'>\
                   <td class='text-left text name'>" + obj.name + "</td>\
                   <td class='text-right number price'>" + obj.price.toFixed(2) + "</td>\
                   <td class='text-right number quantity'>" + obj.quantity + "</td>\
                   <td class='text-right number subtotal'>"
                   + obj.subtotal.toFixed(2) + "</td>\
               </tr>";
    $('#cartBody').append(row);
    updateTotalPrice(obj.price);
}

function updateCart(id, pos) {
    cart[pos].quantity += 1;
    cart[pos].subtotal = cart[pos].quantity * cart[pos].price;
    $('#' + id + ' .quantity').text(cart[pos].quantity);
    $('#' + id + ' .subtotal').text(cart[pos].subtotal.toFixed(2));
    updateTotalPrice(cart[pos].price);
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

function updateTotalPrice(price) {
    totalPrice += price;
    $('#total').val(totalPrice.toFixed(2));
}

function loadProductBtns(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].isActive) {
            productList.push(data[i]);
        }
    }
    for (let i = 0; i < productList.length; i++) {
        let html = "<button type='secondary' class='btn btn-secondary btn-lg item'\
                            id='" + productList[i].id + "'>" + productList[i].name;
        $('#pGroup').append(html);
    }
}
