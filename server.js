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
let noOfMessages = 0;
let alreadyUser = false;

const db = new sqlite3.Database('database.db');

app.use(bodyParser.urlencoded({ // support encoded bodies
    extended: true
}));

function formatDate(d) {
    var date = new Date(d);

    if (isNaN(date.getTime())) {
        return d;
    } else {

        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";

        day = date.getDate();

        if (day < 10) {
            day = "0" + day;
        }

        return day + " " + month[date.getMonth()] + " " + date.getFullYear();
    }

}




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

let registerUser = (username, password, phone, email) => {
    db.get('SELECT COUNT(*) count from USER WHERE USERNAME = ?;', [username], (err, result) => { /////QUERY TO CHECK IF USER ALREADY EXISTS
        if (err) {
            console.log(err);
        } else if (result.count == 0) {
            db.serialize(function () {
                try {
                    let stmt = db.prepare("INSERT INTO USER(USERNAME,PASSWORD,PHONE,EMAIL) values(?,?,?,?)");
                    stmt.run(username, password, phone, email);
                    stmt.finalize();
                    user = username;
                    console.log(user + " registered.");
                } catch (err) {
                    console.log(err);
                }
            });
        } else {
            alreadyUser = true;
        }
    });
    //db.close();
}

let addUserBooking = (username, date, time, noStaff, desc, zipcode, job) => {
    db.serialize(function () {
        try {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var dateNow = yyyy + '-' + mm + '-' + dd;
            let stmt = db.prepare("INSERT INTO ORDERS(DATE,TIME,NO_OF_STAFF,DESCRIPTION,ZIPCODE,USERID,JOB,ADDEDDATE) values(?,?,?,?,?,(SELECT USERID FROM USER WHERE USERNAME=?),?,?);");
            stmt.run(formatDate(date), time, noStaff, desc, zipcode, username, job, formatDate(dateNow));
            stmt.finalize();
            user = username;
            console.log("Order of " + user + " booked.");
        } catch (err) {
            console.log("Oh no")
        }
    });

    //db.close();
}

let getUserOrders = (username) => {
    let arr = [];
    const sql = 'SELECT ORDERID ordid,DATE date,NO_OF_STAFF nos,DESCRIPTION desc,ZIPCODE zip, JOB jb, STATUS stats, ADDEDDATE ad, TIME tm FROM ORDERS WHERE USERID = (SELECT USERID FROM USER WHERE USERNAME = ?) ORDER BY ORDERID DESC;';
    db.each(sql, [username], (err, row) => {
        if (err) {
            throw err;
        }
        arr.push({
            ORDERID: row.ordid,
            DATE: row.date,
            NO_OF_STAFF: row.nos,
            DESCRIPTION: row.desc,
            ZIPCODE: row.zip,
            JOB: row.jb,
            STATUS: row.stats,
            ADDEDDATE: row.ad,
            TIME: row.tm
        });
        //console.log(`${row.ordid} ${row.date} - ${row.nos}`);
    });
    return arr;
    //db.close();
}

let getAllOrders = () => {
    let arr = [];
    const sql = 'SELECT USERNAME uname, PHONE phno, EMAIL email, ORDERID ordid,DATE date,NO_OF_STAFF nos,DESCRIPTION desc,ZIPCODE zip, JOB jb, STATUS stats, ADDEDDATE ad, TIME tm FROM ORDERS, USER WHERE USER.USERID = ORDERS.USERID;';
    db.each(sql, (err, row) => {
        if (err) {
            throw err;
        }
        arr.push({
            ORDERID: row.ordid,
            DATE: row.date,
            NO_OF_STAFF: row.nos,
            DESCRIPTION: row.desc,
            ZIPCODE: row.zip,
            JOB: row.jb,
            STATUS: row.stats,
            ADDEDDATE: row.ad,
            TIME: row.tm,
            USERNAME: row.uname,
            PHONENO: row.phno,
            EMAIL: row.email
        });
        //console.log(`${row.ordid} ${row.date} - ${row.nos}`);
    });
    return arr;
    //db.close();
}

let addMessage = (fname, lname, email, phone, message) => {
    db.serialize(function () {
        try {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var dateNow = yyyy + '-' + mm + '-' + dd;
            let stmt = db.prepare("INSERT INTO MESSAGES(FNAME,LNAME,EMAIL,PHONE,MESSAGE,DATE) values(?,?,?,?,?,?);");
            stmt.run(fname, lname, email, phone, message, formatDate(dateNow));
            stmt.finalize();
            user = username;
            console.log("Message sent.");
        } catch (err) {
            console.log("Oh no")
        }
    });

    //db.close();
}

let getNoOfMessages = () => {
    db.get('SELECT COUNT(*) count from MESSAGES;', (err, result) => { /////QUERY TO CHECK IF USER ALREADY EXISTS
        if (err) {
            console.log(err);
        } else {
            noOfMessages = result.count;
        }
    });
    //
}


let getAllMessages = () => {
    let arr = [];
    const sql = 'SELECT FNAME fn,LNAME ln,EMAIL email,PHONE phno,MESSAGE msg ,DATE dt FROM MESSAGES';
    db.each(sql, (err, row) => {
        if (err) {
            throw err;
        }
        arr.push({
            FNAME: row.fn,
            LNAME: row.ln,
            EMAIL: row.email,
            PHONE: row.phno,
            MESSAGE: row.msg,
            DATE: row.dt
        });
        //console.log(`${row.ordid} ${row.date} - ${row.nos}`);
    });
    return arr;
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
            navButton: {
                text: 'Login / Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('home', {
        navButton: {
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
            navButton: {
                text: 'Login / Register',
                link: '/login'
            },
            empty: 'Nothing'
        });
    } else res.render('about', {
        navButton: {
            text: 'Profile',
            link: '/profile'
        },
        empty: 'Nothing'
    });
});

// Contact Page
// fname=Tejas&lname=Suvarna&email=tejasnareshsuvarna%40gmail.com&phonr=09008402620&message=Testing
app.get('/contact', (req, res) => {
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
        if (user === '') {
            res.render('contact', {
                navButton: {
                    text: 'Login / Register',
                    link: '/login'
                },
                empty: 'Nothing'
            });
        } else res.render('contact', {
            navButton: {
                text: 'Profile',
                link: '/profile'
            },
            empty: 'Nothing'
        });
    } else {
        //console.log(req.query);
        if (req.query.fname === undefined || req.query.lname === undefined || req.query.email === undefined || req.query.phone === undefined || req.query.message === undefined ||
            req.query.fname === '' || req.query.lname === '' || req.query.email === '' || req.query.phone === '' || req.query.message === '') {
            res.render('errorContact', {
                navButton: {
                    text: 'Profile',
                    link: '/profile'
                },
                empty: 'Nothing'
            });
            return;
        }
        addMessage(req.query.fname, req.query.lname, req.query.email, req.query.phone, req.query.message);
        res.render('successContact', {
            navButton: {
                text: 'Profile',
                link: '/profile'
            },
            empty: 'Nothing'
        });
    }
});

// Construction Page
app.get('/construction', (req, res) => {
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
        if (user === '') {
            res.render('construction', {
                navButton: {
                    text: 'Login / Register',
                    link: '/login'
                },
                empty: 'Nothing'
            });
        } else res.render('construction', {
            navButton: {
                text: 'Profile',
                link: '/profile'
            },
            empty: 'Nothing'
        });
    } else {
        if (user === '') {
            res.redirect('login');
        } else {
            //console.log(req.query);
            if (req.query.date === undefined || req.query.time === undefined || req.query.nostaff === undefined || req.query.desc === undefined || req.query.zip === undefined ||
                req.query.date === '' || req.query.time === '' || req.query.nostaff === '' || req.query.desc === '' || req.query.zip === '') {
                res.render('errorBooking', {
                    navButton: {
                        text: 'Profile',
                        link: '/profile'
                    },
                    empty: 'Nothing'
                });
                return;
            }
            addUserBooking(user, req.query.date, req.query.time, req.query.nostaff, req.query.desc, req.query.zip, "Construction");
            res.render('successBooking', {
                navButton: {
                    text: 'Profile',
                    link: '/profile'
                },
                empty: 'Nothing'
            });
        }
    }
});

// Cleaning Page
app.get('/cleaning', (req, res) => {
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
        if (user === '') {
            res.render('cleaning', {
                navButton: {
                    text: 'Login / Register',
                    link: '/login'
                },
                empty: 'Nothing'
            });
        } else res.render('cleaning', {
            navButton: {
                text: 'Profile',
                link: '/profile'
            },
            empty: 'Nothing'
        });
    } else {
        if (user === '') {
            res.redirect('login');
        } else {
            //console.log(req.query);
            if (req.query.date === undefined || req.query.time === undefined || req.query.nostaff === undefined || req.query.desc === undefined || req.query.zip === undefined ||
                req.query.date === '' || req.query.time === '' || req.query.nostaff === '' || req.query.desc === '' || req.query.zip === '') {
                res.render('errorBooking', {
                    navButton: {
                        text: 'Profile',
                        link: '/profile'
                    },
                    empty: 'Nothing'
                });
                return;
            }
            addUserBooking(user, req.query.date, req.query.time, req.query.nostaff, req.query.desc, req.query.zip, "Cleaning");
            res.render('successBooking', {
                navButton: {
                    text: 'Profile',
                    link: '/profile'
                },
                empty: 'Nothing'
            });
        }
    }
});

// Repair Page
app.get('/repair', (req, res) => {
    if (Object.entries(req.query).length === 0 && req.query.constructor === Object) {
        if (user === '') {
            res.render('repair', {
                navButton: {
                    text: 'Login / Register',
                    link: '/login'
                },
                empty: 'Nothing'
            });
        } else res.render('repair', {
            navButton: {
                text: 'Profile',
                link: '/profile'
            },
            empty: 'Nothing'
        });
    } else {
        if (user === '') {
            res.redirect('login');
        } else {
            //console.log(req.query);
            if (req.query.date === undefined || req.query.time === undefined || req.query.nostaff === undefined || req.query.desc === undefined || req.query.zip === undefined ||
                req.query.date === '' || req.query.time === '' || req.query.nostaff === '' || req.query.desc === '' || req.query.zip === '') {
                res.render('errorBooking');
                return;
            }
            addUserBooking(user, req.query.date, req.query.time, req.query.nostaff, req.query.desc, req.query.zip, "Repair");
            res.render('successBooking', {
                navButton: {
                    text: 'Profile',
                    link: '/profile'
                },
                empty: 'Nothing'
            });
        }
    }
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

// Admin Messages Page
app.get('/admin/messages', (req, res) => {
    let messages = getAllMessages();
    const redirect = () => {
        console.log("Fetch all messages.");
        console.log(messages);
        if (messages.length == 0) {
            noResultsDiv = {
                bear: 'block',
                orders: 'none'
            }
        } else {
            noResultsDiv = {
                bear: 'none',
                orders: 'block'
            }
        }
        //console.log('messages ' + noOfMessages);
        res.render('messages', {
            navButton: {
                text: 'Profile',
                link: '/adminProfile'
            },
            messages,
            user,
            noResultsDiv,
            messagesNO : noOfMessages,
        });
    }
    setTimeout(redirect, 1000);
});

//Displaying orders in profile
app.get('/profile', (req, res) => {
    if (user == 'admin') {
        let entries = getAllOrders();
        getNoOfMessages();
        const redirect = () => {
            console.log("Fetch all orders.");
            console.log(entries);
            if (entries.length == 0) {
                noResultsDiv = {
                    bear: 'block',
                    orders: 'none'
                }
            } else {
                noResultsDiv = {
                    bear: 'none',
                    orders: 'block'
                }
            }
            //console.log('messages ' + noOfMessages);
            res.render('adminProfile', {
                navButton: {
                    text: 'Profile',
                    link: '/adminProfile'
                },
                entries,
                user,
                noResultsDiv,
                messagesNO : noOfMessages
            });
        }
        setTimeout(redirect, 1000);
    } else {
        let entries = getUserOrders(user);
        const redirect = () => {
            console.log("Fetch user data.");
            console.log(entries);
            if (entries.length == 0) {
                noResultsDiv = {
                    bear: 'block',
                    orders: 'none'
                }
            } else {
                noResultsDiv = {
                    bear: 'none',
                    orders: 'block'
                }
            }
            res.render('profile', {
                navButton: {
                    text: 'Profile',
                    link: '/profile'
                },
                entries,
                user,
                noResultsDiv
            });
        }
        setTimeout(redirect, 1000);
    }
});


/****PROCESSING REQUESTS****/

// Authenticating User Login
app.post('/login/auth', (req, res) => {
    const redirect = () => {
        console.log(user + " logged in.");
        if (user === 'admin') {
            res.redirect('/profile');
        } else if (user !== '') {
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
        } else {
            res.redirect('/registerInvalid');
        }
    }
    const username = req.body['username'];
    const password = req.body['password'];
    const phone = req.body['phone'];
    const email = req.body['email'];
    registerUser(username, password, phone, email);
    setTimeout(redirect, 1000);
});

// Logout
app.get('/logout', (req, res) => {
    user = '';
    res.redirect('/');
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