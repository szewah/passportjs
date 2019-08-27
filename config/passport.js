var passport = require('passport');
var db = require('../models');
var bcrypt = require('bcryptjs');
var localStrategy = require('passport-local');

// module.exports = function(passport) {
// passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
//     User
//     .findOne({where: {email: email}})
//     .then(user => {
//         if (!user) {
//             return done (null, false, {message: "We couldn't find that email"});    
//         }
//         bcrypt.compare(password, user[0].dataValues.password, (err, isMatch) => {
//             if (err) {console.log("Passowrd error")};
//             if (isMatch) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, {message: "Your password is incorrect"});
//             }
//         });
//     });
// }));
// );


passport.use(new localStrategy(
    {
    usernameField: "email"
},
    function(email, password, done) {
        db.User
        .findOne({where: {email: email}})
        .then((dbUser) => {
            if(!dbUser) {
                return done (null, false, {
                    message: "We couldn't find that email"
                }); 
            }
            else if (!dbUser.validPassword(password)) {
                return done (null, false, {
                    message: "Password incorrect"
                });
            }
            return done(null, dbUser);
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(id, done) {
    User.findById(function(err, user) {
    done(err, user);
    });
});

module.exports = passport;
