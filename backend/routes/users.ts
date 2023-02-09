import express, { Router, Request, Response } from "express";
import passport from '../middlewares/passport';
import { getNewTokenPair, getQueryValueAsArray } from "../utils/utils";
import { addUser, getUsersByTreeMembers, getUsers, getUserById } from '../services/userService';
import { validateLoginCredentials } from "../middlewares/login";
import { getUserTreeMembersById } from "../services/neoTreeService";

const router: Router = express.Router({mergeParams: true});

router.get('/', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    if (req.query.treeMembers) {
        return handleTreeMembersQuery(req, res);
    };

    const response = await getUsers()
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
});

const handleTreeMembersQuery = async (req: Request, res: Response) => {
    const treeMembers = getQueryValueAsArray(req.query.treeMembers as string);
    const response = await getUsersByTreeMembers(treeMembers);
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
}

router.get('/:id', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    const response = await getUserById(req.params.id);
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }

    return res.json(response.result);
});

router.get('/:id/tree', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response) => {
    const response = await getUserTreeMembersById(req.params.id);
    if (response.statusCode !== 200) {
        return res.status(response.statusCode).send(response.result);
    }
    return res.json(response.result);
});


router.post('/login', validateLoginCredentials, async (req: Request, res: Response) => {
    const user = req.user || { };

    const { refreshToken, token } = getNewTokenPair(user.login || "");

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      });
  
    return res.send({ token, user });
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
    
    return res.send({ token, user: response.result });
})
    
router.post('/logout', (req: Request, res: Response) => {
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
  
    return res.send({ token, user });
})
  

export default router;
