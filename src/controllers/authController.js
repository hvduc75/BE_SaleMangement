import authService from '../service/authService';
import nodemailer from 'nodemailer';
require('dotenv').config();

const handleLogin = async (req, res) => {
    try {
        let data = await authService.handleUserLogin(req.body);
        if (data && data.DT && data.DT.access_token) {
            res.cookie('access_token', data.DT.access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie('refresh_token', data.DT.refresh_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 48 * 1000,
            });
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const handleRegister = async (req, res) => {
    try {
        let data = await authService.handleUserRegister(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const handleLogout = async (req, res) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({
            EM: 'clear cookies done!',
            EC: 0,
            DT: '',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const handleRefreshToken = async (req, res) => {
    try {
        let data = await authService.handleRefreshToken(req.cookies);
        if (data && data.DT && data.DT.access_token) {
            res.cookie('access_token', data.DT.access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const checkTokenLogin = async (req, res) => {
    try {
        let userId = req.query.userId;
        let tokenLogin = req.query.tokenLogin;
        let data = await authService.checkTokenLogin(userId, tokenLogin);
        if (data && data.DT && data.DT.access_token) {
            res.cookie('access_token', data.DT.access_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie('refresh_token', data.DT.refresh_token, {
                httpOnly: true,
                maxAge: 60 * 60 * 48 * 1000,
            });
        }
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const sendCode = async (req, res) => {
    try {
        console.log(req.body)
        let data = await authService.checkUserWithEmail(req.body.email)
        console.log(data)
        if(data && data.EC !== 0){
            return res.status(200).json({
                EM: 'Email does not exist',
                EC: 1,
                DT: '',
            });
        }
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const OTP = Math.floor(100000 + Math.random() * 900000);

        try {
            await transporter.sendMail({
                from: '"Tiki-Shop 👻" <maddison53@ethereal.email>',
                to: `${req.body.email}`,
                subject: 'Your OTP ✔',
                text: 'Hello world?',
                html: `<b>Tiki-Shop</b>
                <div>Your OTP: ${OTP}</div>`,
            });
            await authService.updateUserCode(req.body.email, OTP)
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
    return res.status(200).json({
        EC: 0,
        DT: { email: req.body.email },
    });
};

const resetPassword = async (req, res) => {
    try {
        let data = await authService.resetPassword(req.body)
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: '',
        });
    }
};

module.exports = {
    handleLogin,
    handleRegister,
    handleLogout,
    handleRefreshToken,
    checkTokenLogin,
    sendCode,
    resetPassword
};
