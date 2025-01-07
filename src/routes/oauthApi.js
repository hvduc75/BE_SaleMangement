import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController';

const router = express.Router();

const initOAuthApiRoutes = (app) => {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

    router.get(
        '/google/redirect',
        passport.authenticate('google', { failureRedirect: '/login', session: false }),
        (req, res) => {
            res.redirect(`${process.env.REACT_URL}/code/${req.user?.id}/${req.user?.tokenLogin}`);
        },
    );

    router.get('/checkTokenLogin', authController.checkTokenLogin);

    router.get('/auth/facebook', passport.authenticate("facebook", { session: false, scope: ["email"] }));

    router.get(
        '/facebook/redirect',
        passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
        (req, res) => {
            res.redirect(`${process.env.REACT_URL}/code/${req.user?.id}/${req.user?.tokenLogin}`);
        },
    );

    return app.use('/', router);
};

export default initOAuthApiRoutes;
