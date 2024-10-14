import productDetailApiService from "../service/productDetailApiService";

const createUpdateFunc = async (req, res) => {
    try {
        let data = await productDetailApiService.createUpdateProductDetail(req.body);
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
}

const readFunc = async (req, res) => {
    try {
        let productId = req.query.productId;
        let data = await productDetailApiService.getProductDetail(productId);
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
}

module.exports = {
    createUpdateFunc, readFunc
}