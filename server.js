////////#### IMPORTS ####////////

const express = require('express');
const hbs = require('express-handlebars');
//const bodyParser = require('body-parser');
// const fetch = require('node-fetch');
const app = express();

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

////////////////////////////////
////////////////////////////////


////////#### SETTING UP PORTS ####////////

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`SweepWell Server up on port ${port}`);
});

////////////////////////////////
////////////////////////////////