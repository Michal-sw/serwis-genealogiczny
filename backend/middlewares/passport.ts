import passport from 'passport';
import { VerifyCallback, ExtractJwt, Strategy, StrategyOptions, JwtFromRequestFunction } from 'passport-jwt';
import passportHttp, { BasicVerifyFunction } from 'passport-http';
import User, { IUser } from '../config/models/User';
import { MongooseError } from 'mongoose';
import { getCookie, getPrivateKey } from '../utils/utils';
import { getUserIfPasswordMatches } from '../services/userService';

// passport.initialize();
// passport.session();

const validateUser: BasicVerifyFunction = async (login, password, done) => {
    const user = await getUserIfPasswordMatches({ login, password });

    if (user) {
        done(null, user);
    } else {
        done("Credentials invalid", null);
    }
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

const jwtRefreshOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        const cookies = req.headers.cookie || "";
        return getCookie(cookies, "refreshToken");
    }]),
    secretOrKey: getPrivateKey(),
}

passport.use("jwt", new Strategy(jwtOptions, validateJwt));
passport.use("jwt-refresh", new Strategy(jwtRefreshOptions, validateJwt));
passport.use("basic", new passportHttp.BasicStrategy(validateUser));

export default passport;