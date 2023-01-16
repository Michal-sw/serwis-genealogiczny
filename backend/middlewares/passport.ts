import passport from 'passport';
import { VerifyCallback, ExtractJwt, Strategy, StrategyOptions, JwtFromRequestFunction } from 'passport-jwt';
import User, { IUser } from '../config/models/User';
import { MongooseError } from 'mongoose';
import { getCookie, getPrivateKey } from '../utils/utils';

// passport.initialize();
// passport.session();

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

const jwtRefreshOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        const cookies = req.headers.cookie || "";
        return getCookie(cookies, "refreshToken");
    }]),
    secretOrKey: getPrivateKey(),
}

passport.use("jwt", new Strategy(jwtOptions, validateJwt));
passport.use("jwt-refresh", new Strategy(jwtRefreshOptions, validateJwt));

export default passport;