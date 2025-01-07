require('dotenv').config();
import passport from 'passport';
import authServices from '../../service/authService';
const FacebookStrategy = require('passport-facebook').Strategy;

const configLoginWIthFacebook = () => {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
                profileFields: ['id', 'displayName', 'photos', 'email'],
            },
            async function (accessToken, refreshToken, profile, cb) {
                const typeAcc = 'FACEBOOK';
                const dataRaw = {
                    username: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value :  profile.id,
                };
                let user = await authServices.upsertUserSocialMedia(typeAcc, dataRaw);
                return cb(null, user);
            },
        ),
    );
};

export default configLoginWIthFacebook;
