import authService from '../service/authService';

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

module.exports = {
    handleLogin,
    handleRegister,
    handleLogout,
    handleRefreshToken,
    checkTokenLogin,
};
