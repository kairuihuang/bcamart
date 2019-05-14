// global variables
const months = ['January, February, March, April, May, June, July, August, September, October, November, December'];
var productList = [];
var cart = [];
var volunteers = [];
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
            // TODO: Replace all confirm & alert prompts with modals
            let response = confirm('Are you sure you want to clear the cart and all discounts?');
            if (response) { clearCart(); }
            else {
                event.preventDefault();
            }
        });

        $('#cashBtn').click((event) => {
            // if no items don't cash, or discount applied to empty cart
            if (cart.length === 0 || (discount !== 0 && totalPrice < 0) ) {
                alert('cart is empty, can\'t cash');
                event.preventDefault();
            }
            else {
                submitTransaction();
                clearCart();
                $('#transactionToast').toast('show');
            }
        });
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

function clearCart() {
    cart = [];
    totalPrice = 0;
    discount = 0;
    subtotal = 0;
    $('#cart tbody').empty();
    $('#subtotal').val('0.00');
    $('#discount').val('0.00');
    $('#total').val('0.00');
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

function submitTransaction() {
    let volunteers = createVolunteersObj();
    let items = createItemsObj();
    let timestamp = generateTimestamp();
    let id = Date.now();

    let transaction = {
        id: id,
        timestamp: timestamp,
        volunteers: volunteers,
        items: items,
        grossTotal: subtotal,
        discount: discount,
        netTotal: totalPrice
    }

    $.post('/submitTransaction', transaction);
}

function generateTimestamp() {
    let milliseconds = Date.now();
    let dateObj = new Date(milliseconds);

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let day = dateObj.getDay();

    let monthStr = months[month - 1];

    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    // stuff for formatting time
    let twelveHour = ((hour + 11) % 12 + 1);
    let timeOfDay = 'PM';
    if (hour > 12) { timeOfDay = 'AM'; }
    let formattedTime = twelveHour + ':' + minutes + ':' + seconds + ' ' + timeOfDay;

    // stuff for formatting date
    let mm;
    let dd;
    if (month < 10) { mm = '0'  + month; }
    if (date < 10) { dd = '0' + date; }
    let formattedDate = mm + '/' + dd + '/' + year;

    let timestamp = {
        year: year,
        month: month,
        monthStr: monthStr,
        date: date,
        day: day,
        hour: hour,
        minutes: minutes,
        seconds: seconds,
        formattedTime: formattedTime,
        formattedDate: formattedDate,
    }

    return timestamp;
}

function createVolunteersObj() {
    let list = [];
    for (let i = 0; i < volunteers.length; i++) {
        list[i] = {
            id: volunteers[i].id,
            name: volunteers[i].name
        };
    }
    return list;
}

function createItemsObj() {
    let list = [];
    for (let i = 0; i < cart.length; i++) {
        list[i] = {
            id: cart[i].id,
            name: cart[i].name,
            price: cart[i].price,
            quantity: cart[i].quantity,
            subtotal: cart[i].subtotal
        }
    }
    return list;
}
