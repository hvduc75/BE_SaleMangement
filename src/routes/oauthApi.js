import express from 'express';
import  passport  from 'passport';

const router = express.Router();

const initOAuthApiRoutes = (app) => {
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get(
        '/google/redirect',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            console.log(req.user);
            res.redirect('/');
        },
    );
    return app.use('/', router);
};

export default initOAuthApiRoutes;