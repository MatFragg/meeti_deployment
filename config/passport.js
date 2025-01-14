import passport from "passport"
import LocalStrategy from 'passport-local'
import Users from "../models/Users.js"

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    },
    async(email,password,next) => {
        const user = await Users.findOne({where: {email,active:1}});
        
        // Review if user exists or not
        if(!user) return next(null,false,{
            message: 'This User does not exist'
        });

        // IF user exists , compare the passwords
        const verifyPass = user.validatePassword(password);

        // If password is not correct
        if(!verifyPass) return next(null,false,{
            message: 'The password is incorrect'
        })

        // All is ok
        return next(null,user)
    }
))

passport.serializeUser(function(user,cb){
    cb(null,user);
});
passport.deserializeUser(function(user,cb){
    cb(null,user);
});

export default passport