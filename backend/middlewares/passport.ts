import passport from 'passport';
import { VerifyCallback, ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passportHttp, { BasicVerifyFunction } from 'passport-http';
import User, { IUser } from '../config/models/User';
import { MongooseError } from 'mongoose';
import { getPrivateKey } from '../utils/utils';

// passport.initialize();
// passport.session();

const validateUser: BasicVerifyFunction = (login, password, done) => {
    User.findOne({login}, (err: MongooseError, user: IUser | null) => {
        if (err) {
            done(err);
        }
        if (user) {
            // if (user.password === HASH(password)) {
            // dla ułatwienia hasła będą w „plain text” (nie używać „produkcyjnie”!)
            if (user.password === password) {
                done(null, user);
            } else {
                done(null, null);
            }
        } else {
            done(null, null);
        }
    });
};

const validateJwt: VerifyCallback = (jwtPayload, done) => {
    User.findOne({login: jwtPayload }, (err: MongooseError, user: IUser | null) => {
        if (err) done(err.message);
        if (user) done(null, user);
    });

}



const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getPrivateKey(),
}

passport.use(new Strategy(jwtOptions, validateJwt));
passport.use(new passportHttp.BasicStrategy(validateUser));

export default passport;