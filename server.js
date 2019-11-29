////////#### IMPORTS ####////////

const express = require('express');
const hbs = require('express-handlebars');
//const bodyParser = require('body-parser');
// const fetch = require('node-fetch');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

////////////////////////////////
////////////////////////////////


////////#### GLOBAL ####////////

let user = '';
let alreadyUser = false;

const db = new sqlite3.Database('database.db');

app.use(bodyParser.urlencoded({ // support encoded bodies
    extended: true
}));


let getUser = (username, password) => {
    db.get('SELECT COUNT(*) count from USER WHERE USERNAME = ? AND PASSWORD = ?;', [username, password], (err, result) => { /////QUERY TO CHECK IF USER ALREADY EXISTS
        if (err) {
            console.log(err);
        } else if (result.count == 1) {
            user = username;
        }
    });
    //db.close();
}

let registerUser = (username, password) => {
    db.get('SELECT COUNT(*) count from USER WHERE USERNAME = ?;', [username], (err, result) => { /////QUERY TO CHECK IF USER ALREADY EXISTS
        if (err) {
            console.log(err);
        } else if (result.count == 0) {
            db.serialize(function () {
                try {
                    var stmt = db.prepare("INSERT INTO USER(USERNAME,PASSWORD) values(?,?)");
                    stmt.run(username, password);
                    stmt.finalize();
                    user = username;
                    console.log(user + " registered.");
                } catch (err) {
                    console.log("Oh no")
                }
            });
        } else {
            alreadyUser = true;
        }
    });
    //db.close();
}


////////////////////////////////
////////////////////////////////

////////#### SQL ####////////

/*
var userid1, ordinfo;
db.all('SELECT userid uid,username uname FROM USER ', (err, result) => {
    if (err) {
        console.log(err)
    } else {
        userid1 = result;
        console.log("This is the", userid1[1]);
    }
})
db.close();
*/

////////////////////////////////
////////////////////////////////


////////#### HBS SETUP ####////////

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');

////////////////////////////////
////////////////////////////////


////////#### FOR LINKS ####////////

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));

////////////////////////////////
////////////////////////////////


////////#### CHECKING FOR ROUTES ####////////

/****RENDERING HTML PAGES****/

// Home Page
app.get('/', (req, res) => {
    if (user === '') {
        res.render('home', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('home', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// About Page
app.get('/about', (req, res) => {
    if (user === '') {
        res.render('about', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('about', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Contact Page
app.get('/contact', (req, res) => {
    if (user === '') {
        res.render('contact', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('contact', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Construction Page
app.get('/construction', (req, res) => {
    if (user === '') {
        res.render('construction', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('construction', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Cleaning Page
app.get('/cleaning', (req, res) => {
    if (user === '') {
        res.render('cleaning', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('cleaning', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Repair Page
app.get('/repair', (req, res) => {
    if (user === '') {
        res.render('repair', {
            navButton:{
                text: 'Login/Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('repair', {
        navButton:{
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Login Invalid Page
app.get('/loginInvalid', (req, res) => {
    res.render('loginInvalid');
});

// Register Page
app.get('/register', (req, res) => {
    res.render('register');
});

// Register Invalid Page
app.get('/registerInvalid', (req, res) => {
    res.render('registerInvalid');
});

/****PROCESSING REQUESTS****/

// Authenticating User Login
app.post('/login/auth', (req, res) => {
    const redirect = () => {
        console.log(user + " logged in.");
        if (user !== '') {
            res.redirect('/');
        } else {
            res.redirect('/loginInvalid');
        }
    }
    const username = req.body['username'];
    const password = req.body['password'];
    getUser(username, password);
    setTimeout(redirect, 1000);
});

// Authenticating User Register
app.post('/register/auth', (req, res) => {
    const redirect = () => {
        console.log(user + " logged in.");
        if (!alreadyUser) {
            res.redirect('/');
        } else{
            res.redirect('/registerInvalid');
        }
    }
    const username = req.body['username'];
    const password = req.body['password'];
    registerUser(username, password);
    setTimeout(redirect, 1000);
});

////////////////////////////////
////////////////////////////////


////////#### SETTING UP PORTS ####////////

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`SweepWell Server up on port ${port}`);
});

////////////////////////////////
////////////////////////////////