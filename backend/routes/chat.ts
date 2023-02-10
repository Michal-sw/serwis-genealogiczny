import express, { Router, Request, Response } from "express";
import passport from '../middlewares/passport';
import { addMessage, getGlobalChat } from "../services/chatService";
import { Types } from "mongoose";
import { MessageDT } from "../types/MessageDT";

const router: Router = express.Router({mergeParams: true});

router.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {

    const response = await getGlobalChat();
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
});

router.post('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    const message: MessageDT = {
        text: req.body.text,
        author: new Types.ObjectId(req.body.author)
    };

    const response = await addMessage(message);
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
});

export default router;
