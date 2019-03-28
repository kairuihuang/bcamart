// 1) Imports and middleware ___________________________________________________
const express = require('express');
const firebase = require('firebase');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const upload = multer();

const config = {
  apiKey: 'AIzaSyCtyH_NnJVubNiJLycE7dcO_svhpCHQf-8',
  authDomain: 'database-cdf92.firebaseapp.com',
  databaseURL: 'https://database-cdf92.firebaseio.com',
};

firebase.initializeApp(config);
const database = firebase.database();

app.set('view engine', 'pug');
app.set('views','./public/views');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

// 2) Product page routing _____________________________________________________
app.get('/', (req, res) => {
	res.send('Welcome to the root page!');
});

app.get('/products', (req, res) => {
	res.render('products');
});

app.get('/products/addProduct', (req, res) => {
	res.render('addProduct');
});

app.get('/products/:id', (req, res) => {
	res.render('editProduct', {id: req.params.id});
});

// 3) Product page actions _____________________________________________________
// get all products in DB
app.get('/loadProducts', (req, res) => {
	database.ref('/products/list').once('value').then((snap) => {
		const products = snap.val();
		res.send(products);
	});
});

// loads single product by ID
app.get('/loadProduct/:id', (req, res) => {
	database.ref('/products/list/' + req.params.id).once('value').then((snap) => {
		const product = snap.val();
		res.send(product);
	});
});

// gets list of departments
app.get('/getDepartments', (req, res) => {
    database.ref('/departments/list').once('value').then((snap) => {
        const departments = snap.val();
        res.send(departments);
    });
});

// delete product by ID
app.post('/deleteProduct/:id', (req, res) => {
    const proID = req.params.id;

    const ref = database.ref('/products/list/' + proID);
    ref.once('value').then((snap) => {
        const depID = snap.val().department.id;
        removeProduct_Department(depID, proID);
        database.ref('/products/list/' + proID).remove();
    });

    const ref2 = database.ref('/products/metadata/');
    ref2.once('value').then((snap) => {
        const count = (snap.val().count) - 1;
        ref2.update({ count: count });
    });
});

// add product to DB, assumes unique product name
app.post('/addProductAction', (req, res) => {
	const reqBody = req.body;
    const name = (reqBody.name).trim();
	const price = round(parseFloat(reqBody.price.replace('$', '')), 2);
	const cost =  round(parseFloat(reqBody.cost.replace('$', '')), 2);
	const quantity = parseInt(reqBody.quantity);
    let department;

    if (reqBody.department === null || reqBody.department === undefined) {
        department = 'Unassigned';
    }
    else {
        department = (reqBody.department).trim();
        if (department === '') { department = 'Unassigned'; }
    }

    let isActive = false;
    if (reqBody.isActive === 'on') {isActive = true;}

    addProduct(name, price, cost, quantity, department, isActive);

    res.redirect('http://localhost:4000/products');
});

// _____________________________________________________________________________

app.get('/transactions', (req, res) => {
	res.render('transactions');
});

app.get('/volunteers', (req, res) => {
	res.render('volunteers');
});

app.post('/addVolunteer', (req, res) => {
	console.log(reqBody);
	const reqBody = req.body;
	addProduct(8, reqBody.name, reqBody.price, reqBody.cost, reqBody.quantity);
	res.redirect('http://localhost:4000/volunteers');
});

app.get('/loadVolunteers', (req, res) => {
	database.ref('/volunteers').once('value').then((snap) => {
		var volunteers = snap.val();
		res.send(volunteers);
		console.log(volunteers);
		console.log(volunteers[0].email)
		console.log(volunteers[1].email)
	});
});

app.get('/cashier', (req, res) =>{
	res.render('cashier');
})

// 8) internal functions _______________________________________________________
function addProduct(name, price, cost, quantity, department, isActive) {
    // prelim calculations
    const margin = round((price-cost)/price, 4);
    const markup = round(((price-cost)/cost), 4);
    const totalVal = round((quantity*cost), 2);

    const ref = database.ref('/products/metadata/');
    ref.once('value').then((snap) => {
        const new_PID = snap.val().newID;
        const proCount = snap.val().count;

        const ref1 = database.ref('/departments/list');
        ref1.once('value').then(async (snap) => {
            let depList = snap.val();
            let depID = getDepartmentID_ByName(depList, department);

            if (depID < 0) { // if dep doesn't exist, add new department
                await addDepartment(department);
                ref1.once('value').then((snap) => { // use updated variables
                    depList = snap.val();
                    depID = getDepartmentID_ByName(depList, department);
                    let productObj = {
                        id: new_PID,
                        name: name,
                        price: price,
                        cost: cost,
                        margin: margin,
                        markup: markup,
                        quantity: quantity,
                        department: {
                            id: depID,
                            name: department
                        },
                        isActive: isActive,
                        totalValue: totalVal
                    };
                    database.ref('/products/list/' + new_PID).set(productObj);
                    addProduct_Department(depID, productObj);
                });
            }
            else {
                let productObj = {
                    id: new_PID,
                    name: name,
                    price: price,
                    cost: cost,
                    margin: margin,
                    markup: markup,
                    quantity: quantity,
                    department: {
                        id: depID,
                        name: department
                    },
                    isActive: isActive,
                    totalValue: totalVal
                };
                database.ref('/products/list/' + new_PID).set(productObj);
                addProduct_Department(depID, productObj);
            }

            // update metadata
            database.ref('/products/metadata').update({
                newID: (new_PID + 1),
                count: (proCount + 1)
            });
        });
    });
}

function removeProduct_Department(depID, proID) {
    database.ref('/departments/list/' + depID + '/products/' + proID).remove();
    const ref = database.ref('/departments/list/' + depID);
    ref.once('value').then((snap) => {
        let newCount = (snap.val().count) - 1;
        ref.update({ count: newCount });
    });
}

function addProduct_Department(depID, productObj) {
    let ref = database.ref('/departments/list/' + depID);
    ref.once('value').then((snap) => {
        let newCount = (snap.val().count) + 1;
        let ref1 = database.ref('/departments/list/' + depID +
                                '/products/' + productObj.id);
        ref1.set(productObj);
        ref.update({ count: newCount });
    });
}

async function addDepartment(department) {
    return new Promise((resolve) => {
        const ref = database.ref('/departments/metadata');
        ref.once('value').then((snap) => {
            const newID = snap.val().newID;
            const count = snap.val().count;

            database.ref('/departments/list/' + newID).set({
                id: newID,
                name: department,
                count: 0,
                products: {}
            });

            ref.update({
                newID: (newID + 1),
                count: (count + 1)
            });
        });
        resolve();
    });
}

function getDepartmentID_ByName(list, name) {
    for (let i = 0; i < list.length; i++) {
        if (name === list[i].name) { return list[i].id; }
    }
    return -1;
}

function addVolunteer(firstName, hours, lastname){
	database.ref('/volunteers').once('value').then((snap) => {
		var volunteers = snap.val();
		database.ref('volunteers/' + volunteers.length).set
		{
			firstName: firstName
			hours: hours
			lastName: lastName
		}
	});
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});
