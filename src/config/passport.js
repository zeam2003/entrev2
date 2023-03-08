import { Strategy as LocalStrategy } from "passport-local";
const passportConfig = (passport, userService) => {
    const strategyOpt = { usernameField: 'email'};

    const signupStrategy = new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true},
        userService.signup
    );

    const loginStrategy = new LocalStrategy(strategyOpt, userService.login);
    passport.use('signup', signupStrategy);
    passport.use('login', loginStrategy);

    // Serialize
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        return done(null, await userService.getuserById(id));
    });
};

export default passportConfig;