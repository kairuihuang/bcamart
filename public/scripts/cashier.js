// global variables
var productList = [];
var cart = [];
var totalPrice = 0;
var discount = 0;
var subtotal = 0;

$(document).ready(function(){

    $.get('/loadProducts', (data, status) => {
        loadProductBtns(data);

        // event handler when product buttons are clicked
        $('.item').click((event) => {
            let id = findProductID(event.target.className);
            let pos = isInCart(cart, id);

            // if not in cart yet
            if (pos === -1) {
                let info = searchProductByID(productList, id);
                if (info !== -1) { addToCart(info); }
                else { alert('product not found'); }
            }
            // update quantity and subtotal of exisiting row
            else { updateCart(id, pos, true); }
        });

        $('#cart tbody').on('click', '.subtract', (event) => {
            let id = findProductID(event.target.className);
            let pos = isInCart(cart, id);
            updateCart(id, pos, false);
            if (cart[pos].quantity === 0) { removeFromCart(id, pos); }
        });

        $('#cart tbody').on('click', '.remove', (event) => {
            let id = findProductID(event.target.className);
            let pos = isInCart(cart, id);
            let newsubtotal = subtotal - cart[pos].subtotal;

            removeFromCart(id, pos);
            updateSubtotal(newsubtotal);
        });

        $('#clearBtn').click((event) => {
            let response = confirm('Are you sure you want to clear the cart and all discounts?');
            if (response) {
                cart = [];
                totalPrice = 0;
                discount = 0;
                subtotal = 0;
                $('#cart tbody').empty();
                $('#subtotal').val('0.00');
                $('#discount').val('0.00');
                $('#total').val('0.00');
            }
            else {
                event.preventDefault();
            }
        });

        $('#cashBtn').click((event) => {
            // if no items don't cash, or discount applied to empty cart
            if (cart.length === 0 || (discount !== 0 && totalPrice < 0) ) {
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
                   <td class='text-center'>\
                       <button type='button' class='btn btn-info btn-block subtract "
                               + obj.id + "'>-</button>\
                   </td>\
                   <td class='text-center'>\
                       <button type='button' class='btn btn-danger btn-block remove "
                               + obj.id + "'>X</button>\
                   </td>\
               </tr>";
    $('#cartBody').append(row);
    updateSubtotal(obj.price, true);
}

function removeFromCart(id, pos) {
    $('#' + id).remove();
    cart.splice(pos, 1);
}

// if isAdding is true, increment values, decrement if false (subtract an item)
function updateCart(id, pos, isAdding) {
    let val;
    if (isAdding) { val = 1; }
    else { val = -1; }

    cart[pos].quantity += val;
    cart[pos].subtotal = cart[pos].quantity * cart[pos].price;
    $('#' + id + ' .quantity').text(cart[pos].quantity);
    $('#' + id + ' .subtotal').text(cart[pos].subtotal.toFixed(2));
    updateSubtotal(cart[pos].price, isAdding);
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

// finds product ID given string of class names. assumes id is at end string
function findProductID(classStr) {
    let arr = classStr.split(' ');
    return Number(arr[(arr.length)-1]);
}

function updateSubtotal(price, isAdding) {
    if (typeof isAdding === 'undefined') {
        subtotal = price;
    }
    // if overloaded, function increments/decrements subtotal
    else {
        let val = price;
        if (!isAdding) { val *= -1; }
        subtotal += val;
    }
    $('#subtotal').val(subtotal.toFixed(2));
    updateTotal();
}

function updateTotal() {
    totalPrice = subtotal - discount;
    $('#total').val(totalPrice.toFixed(2));
}

function loadProductBtns(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].isActive) {
            productList.push(data[i]);
        }
    }
    for (let i = 0; i < productList.length; i++) {
        let html = "<button type='button' class='btn btn-secondary btn-lg item " +
                            productList[i].id + "'>" + productList[i].name;
        $('#pGroup').append(html);
    }
}
