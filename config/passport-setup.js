const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2');
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then( (user) =>{
        done(null, user);
    })
});

passport.use(
    new GoogleStrategy({
        //options for strategy
        callbackURL: '/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (accessToken, refreshToken, profile, done) => {
        //check if user exists
        User.findOne({googleId: profile.id}).then( (currentUser) => {
            if(currentUser){
                console.log('User is: ', currentUser);
                done(null, currentUser);
            }
            else{
               
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    email: profile.email
                }).save().then( (newUser) => {
                    console.log('New User Created: ', newUser);
                    done(null, newUser);
                })
            }
        })  

    }
))