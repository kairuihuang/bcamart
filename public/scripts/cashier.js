// global variables
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
            if (cart.length === 0) {
                alert('Cannot cash cart when empty.');
                event.preventDefault();
            }
            else if (discount !== 0 && totalPrice < 0) {
                alert('Cannot cash cart when total price is less than $0.00.');
                event.preventDefault();
            }
            else {
                submitTransaction();
                clearCart();
                $('#transactionToast').toast('show');
            }
        });

        $('#discountBtn').click((event) => {
            let discountAmount = prompt('Enter discount amount.');
            if (!isNaN(discountAmount) && discountAmount >= 0.00
                && discountAmount < 10.00) {
                discount = Number(Number(discountAmount).toFixed(2));
                $('#discount').val(discount.toFixed(2));
                updateTotal();
            }
            else {
                alert('Invalid value entered. Please note that discount cannot exceed $10.00.')
            }
        });

        $('#clockBtn').click((event) => {
            $('#clockModal').modal('show');
        });

        $('#closeClockModal').click((event) => {
            $('#clockModal').modal('hide');
        });

        $('#clockInBtn').click((event) => {
            let code = $('#volunteerInput').val();
            if (code !== null && code !== '') {
                $.get('/getVolunteer/' + code, (data, status) => {
                    if (data === null || data === '') {
                        alert('Unable to find volunteer with code entered. Please try again.');
                    }
                    else {
                        let index = findVolunteerIndexByCode(data.code);
                        if (index !== -1) {
                            alert(data.firstName + ' ' + data.lastName + ' is already clocked in.');
                        }
                        else {
                            clockInVolunteer(data);
                            alert(data.firstName + ' has been clocked in. Please remember to clock out at the end of your shift to log your hours.');
                        }
                    }
                });
            }
        });

        $('#clockOutBtn').click((event) => {
            let code = $('#volunteerInput').val();
            if (code !== null && code !== '') {
                $.get('/getVolunteer/' + code, (data, status) => {
                    if (data === null || data === '') {
                        alert('Unable to find volunteer with code entered. Please try again.');
                    }
                    else {
                        let index = findVolunteerIndexByCode(data.code);
                        if (index === -1) {
                            alert('Volunteer entered is not currently clocked in.');
                        }
                        else {
                            clockOutVolunteer(index);
                            alert(data.firstName + ' ' + data.lastName + ' has been clocked out.');
                        }
                    }
                });
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

function clockInVolunteer(obj) {
    let timestamp = generateTimestamp();
    let shift = {
        timeIn: timestamp,
        hours: 0
    };
    volunteers.push({
        code: obj.code,
        name: obj.firstName + ' ' + obj.lastName,
        shift: shift
    });

    $('#volunteerInput').val('');
}

function clockOutVolunteer(index) {
    let volunteer = volunteers[index];
    let timestamp = generateTimestamp();
    volunteer.shift.timeOut = timestamp;

    let hourEnd = volunteer.shift.timeOut.hour;
    let minEnd = volunteer.shift.timeOut.minutes;
    let hourStart = volunteer.shift.timeIn.hour;
    let minStart = volunteer.shift.timeIn.minutes;

    if (minStart > minEnd) { minEnd += 60; }
    if (hourStart > hourEnd) { hourEnd += 24; }

    let hours = (hourEnd - hourStart) + ((minEnd-minStart) / 60);

    let jsonStr = JSON.stringify(volunteer);
    $.post('/logShift', {jsonStr});

    $('#volunteerInput').val('');
    volunteers.splice(index, 1);
}

// if found returns index in volunteers array
function findVolunteerIndexByCode(code) {
    for (let i = 0; i < volunteers.length; i++) {
        if (volunteers[i].code === code) { return i; }
    }
    return -1;
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
    let items = createItemsObj();
    let timestamp = generateTimestamp();
    let volunteers = createVolunteersObj();
    if (volunteers.length == 0) { volunteers = 'None'; }
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

    let jsonStr = JSON.stringify(transaction);
    $.post('/submitTransaction', {jsonStr});
}

function generateTimestamp() {
    let milliseconds = Date.now();
    let dateObj = new Date(milliseconds);

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let day = dateObj.getDay();

    let monthStr = months[month - 1];
    let dayStr = daysOfWeek[day];

    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();

    // stuff for formatting time
    let minmin = minutes;
    let ss = seconds;
    if (minutes < 10) { minmin = '0' + minutes; }
    if (seconds < 10) { ss = '0' + seconds; }

    let hh = ((hour + 11) % 12 + 1); // convert to 12 hr time
    if (hh < 10) {hh = '0' + hh; }

    let timeOfDay = 'PM';
    if (hour < 12) { timeOfDay = 'AM'; }

    let formattedTime = hh + ':' + minmin + ':' + ss + ' ' + timeOfDay;

    // stuff for formatting date
    let monmon = month;
    let dd = date;
    if (month < 10) { monmon = '0'  + month; }
    if (date < 10) { dd = '0' + date; }
    let formattedDate = monmon + '/' + dd + '/' + year;

    let timestamp = {
        year: year,
        month: month,
        monthStr: monthStr,
        date: date,
        day: day,
        dayStr: dayStr,
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
            code: volunteers[i].code,
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
