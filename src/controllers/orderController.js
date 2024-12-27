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

const getOrdersByUserId = async (req, res) => {
    try {
        let userId = req.query.userId;
        let condition = req.query.condition;
        let data = await orderApiService.getOrdersByUserId(userId, condition);
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
        let date =
            req.query.date && req.query.date !== 'undefined' && req.query.date !== 'null' ? req.query.date : null;
        let condition =
            req.query.condition && req.query.condition !== 'undefined' && req.query.condition !== 'null'
                ? req.query.condition
                : null;
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

const getAllOrderByCondition = async (req, res) => {
    try {
        let page = req.query.page;
        let limit = req.query.limit;
        let condition = req.query.condition;
        let data = await orderApiService.getAllOrderByCondition(page, limit, condition);
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

const getOrderDetail = async (req, res) => {
    try {
        let orderId = req.query.orderId;
        let data = await orderApiService.getOrderDetail(orderId);
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
}

const getOrderBySearchText = async (req, res) => {
    try {
        let condition = req.query.condition; 
        let searchText = req.query.searchText; 
        let userId = req.query.userId; 

        let data = await orderApiService.getOrderBySearchText(condition, searchText, userId);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Error from server',
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

const cancelOrder = async (req, res) => {
    try {
        let data = await orderApiService.cancelOrder(req.body);
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

const ConfirmDeliveredOrder = async (req, res) => {
    try {
        console.log(req.body.image)
        req.body.image = req.file ? req.file.buffer : null;
        let data = await orderApiService.ConfirmDeliveredOrder(req.body);
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

const getAllOrderInDay = async (req, res) => {
    try {
        let data = await orderApiService.getAllOrderInDay();
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

const getAllOrderInWeek = async (req, res) => {
    try {
        let startDate = req.query.startDate;
        let data = await orderApiService.getAllOrderInWeek(startDate);
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
    getOrdersByUserId,
    getAllOrderPaginate,
    confirmOrder,
    cancelOrder,
    getAllOrderInDay,
    getAllOrderInWeek,
    getAllOrderByCondition,
    getOrderDetail,
    getOrderBySearchText,
    ConfirmDeliveredOrder
};
