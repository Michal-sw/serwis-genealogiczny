import express, { Router, Request, Response, Express } from "express";
import passport from '../middlewares/passport';
import { getNewTokenPair } from "../utils/utils";

const router: Router = express.Router({mergeParams: true});

router.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    console.log(req.user);
    return res.json();
});

router.post('/login', passport.authenticate('basic', {session: false}), async (req: Request, res: Response) => {
    const user = req.user || { };

    const { refreshToken, token } = getNewTokenPair(user.login || "");

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      });
  
    return res.send({ token });
});

export default router;