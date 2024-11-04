import orderApiService from '../service/orderApiService';

const createFunc = async (req, res) => {
    try {
        let data = await orderApiService.createOrder(req.body);
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

const createOrderDetail = async (req, res) => {
    try {
        let data = await orderApiService.createOrder(req.body);
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

const getOrdersByUserId = async (req, res) => {
    try {
        let userId = req.query.userId;
        let data = await orderApiService.getOrdersByUserId(userId);
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

const getAllOrderPaginate = async (req, res) => {
    try {
        let page = req.query.page;
        let limit = req.query.limit;
        let date = req.query.date && req.query.date !== 'undefined' && req.query.date !== 'null'? req.query.date : null;
        let condition = req.query.condition && req.query.condition !== 'undefined' && req.query.condition !== 'null' ? req.query.condition : null;
        console.log(date, condition);
        let data;

        if (condition && date) {
            console.log('test4');
            data = await orderApiService.getAllOrderConfirmPaginate(+page, +limit, condition, date);
        } else if (condition && !date) {
            console.log('test3');
            data = await orderApiService.getAllOrderConfirmPaginate(+page, +limit, condition);
        } else if (!condition && !date) {
            console.log('test2');
            data = await orderApiService.getAllOrderPaginate(+page, +limit);
        } else if (!condition && date) {
            console.log('test');
            data = await orderApiService.getAllOrderPaginate(+page, +limit, date);
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

const confirmOrder = async (req, res) => {
    try {
        let data = await orderApiService.confirmOrder(req.body);
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
    createOrderDetail,
    getOrdersByUserId,
    getAllOrderPaginate,
    confirmOrder,
};
