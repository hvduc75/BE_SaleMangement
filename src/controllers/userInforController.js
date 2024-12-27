import userInforApiService from '../service/userInforApiService';

const createFunc = async (req, res) => {
    try {
        let data = await userInforApiService.createFunc(req.body);
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

const getUserInforDefault = async (req, res) => {
    try {
        let userId = req.query.userId;
        let data = await userInforApiService.getUserInforDefault(userId);
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

const getListUserInfo = async (req, res) => {
    try {
        let userId = req.query.userId;
        let data = await userInforApiService.getListUserInfo(userId);
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

const updateUserInfo = async (req, res) => {
    try {
        let data = await userInforApiService.updateUserInfo(req.body);
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
    createFunc,
    getUserInforDefault,
    getListUserInfo,
    updateUserInfo,
};
