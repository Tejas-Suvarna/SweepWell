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
app.get('/', (req, res) => {
    res.render('home');
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