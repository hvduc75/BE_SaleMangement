require('dotenv').config();
import passport from 'passport';
import authServices from '../../service/authService';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const configLoginWIthGoogle = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
            },
            async function (accessToken, refreshToken, profile, cb) {
                const typeAcc = 'GOOGLE';
                const dataRaw = {
                    username: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                    googleId: profile.id,
                };
                let user = await authServices.upsertUserSocialMedia(typeAcc, dataRaw);
                return cb(null, user);
            },
        ),
    );
};

export default configLoginWIthGoogle;
