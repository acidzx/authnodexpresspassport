// INDEX.JS

const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('./passport');

const app = express();

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    })
)

//Configure Passport
app.use(passport.initialize());
app.use(passport.session());

//Unprotected Routes
app.get('/', (req, res) => {
    res.send('<h1>Home</h1>')
});

app.get('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
});

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

//Protected Route.
app.get('/profile', checkUserLoggedIn, (req, res) => {
    res.send(`<h1>${req.user.displayName}'s Profile Page on ${req.user.provider}</h1>`)
    console.log(req.user)
});

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        res.redirect('/profile');
    }
);

// FACEBOOK

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
    function (req, res) {
        res.redirect('/profile');
    }
);

//Logout
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }

        res.redirect('/');
    });
});

app.listen(3000, () => console.log(`App listening on port ${3000} 🚀🔥`))