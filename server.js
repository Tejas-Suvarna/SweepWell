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
    res.render('home');
});

// About Page
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Construction Page
app.get('/construction', (req, res) => {
    res.render('construction');
});

// Cleaning Page
app.get('/cleaning', (req, res) => {
    res.render('cleaning');
});

// Repair Page
app.get('/repair', (req, res) => {
    res.render('repair');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

// Register Page
app.get('/register', (req, res) => {
    res.render('register');
});

/****PROCESSING REQUESTS****/

// Authenticating the User
app.post('/login/auth', (req, res) => {
    const redirect = () => {
        console.log(user);
        if (user !== '') {
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    }
    const username = req.body['username'];
    const password = req.body['password'];
    getUser(username, password);
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