import express, { Router, Request, Response } from "express";
import passport from '../middlewares/passport';
import { getGlobalChat } from "../services/chatService";

const router: Router = express.Router({mergeParams: true});

router.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {

    const response = await getGlobalChat();
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
});

export default router;
