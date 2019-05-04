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
            let id = findProductID(event.target.className);
            let pos = isInCart(cart, id);

            // if not in cart yet
            if (pos === -1) {
                let info = searchProductByID(productList, id);
                if (info !== -1) { addToCart(info); }
                else { console.log('product not found'); }
            }
            // update quantity and subtotal of exisiting row
            else { updateCart(id, pos, true); }
        });

        // event handler when subtract buttons are clicked
        $('#cart tbody').on('click', '.subtract', (event) => {
            let id = findProductID(event.target.className);
            let pos = isInCart(cart, id);
            updateCart(id, pos, false);
            if (cart[pos].quantity === 0) { removeFromCart(id, pos); }
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
                   <td class='text-center'>\
                       <button type='button'\
                               class='btn btn-sm btn-danger btn-block subtract "
                               + obj.id + "'>-</button>\
                   </td>\
                   <td class='text-right number subtotal'>"
                   + obj.subtotal.toFixed(2) + "</td>\
               </tr>";
    $('#cartBody').append(row);
    updateTotalPrice(obj.price, true);
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
    updateTotalPrice(cart[pos].price, isAdding);
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

function updateTotalPrice(price, isAdding) {
    let val = price;
    if (!isAdding) { val *= -1; }
    totalPrice += val;
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
