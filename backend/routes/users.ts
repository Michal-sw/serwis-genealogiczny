import express, { Router, Request, Response } from "express";
import passport from '../middlewares/passport';
import { getNewTokenPair } from "../utils/utils";
import { addUser } from '../services/userService';
import { validateLoginCredentials } from "../middlewares/login";

const router: Router = express.Router({mergeParams: true});

router.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    console.log(req.user);
    return res.json();
});

router.post('/login', validateLoginCredentials, async (req: Request, res: Response) => {
    const user = req.user || { };

    const { refreshToken, token } = getNewTokenPair(user.login || "");

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      });
  
    return res.send({ token });
});


router.post('/signin', async (req: Request, res: Response) => {
    const response = await addUser(req.body);
    
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }
        
    const { refreshToken, token } = getNewTokenPair(req.body.login);
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
    });
    
    return res.send({ token, result: response.result });
})
    
router.get('/logout', (req: Request, res: Response) => {
    res.cookie('refreshToken', "", {
      httpOnly: true,
      sameSite: 'strict'
    });
  
    return res.send();
})

router.post('/refresh', passport.authenticate('jwt-refresh', {session: false}), (req: Request, res: Response) => {
    const user = req.user || { };

    const { refreshToken, token } = getNewTokenPair(user.login || "");
  
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
    });
  
    return res.send({ token });
  })
  

export default router;
