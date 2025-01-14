import passport from "passport"

const auth_user = passport.authenticate('local',{
    successRedirect: '/meeti-admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required' // Con express
})

// Checks if the user is authenticated or not
const check_auth = (req,res,next) =>{
    // If user is athenticated, continue
    if(req.isAuthenticated()) {
        return next();
    }

    // if user is not athenticated
    return res.redirect('/login');
}

const log_out = async(req,res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('exito','You have been logged out');
    res.redirect('/login');
    });
}

export {
    auth_user,
    check_auth,
    log_out
}