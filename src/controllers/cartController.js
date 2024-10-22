import cartApiService from '../service/cartApiService';

const createFunc = async (req, res) => {
    try {
        let data = await cartApiService.createFunc(userId);
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

const readFunc = async (req, res) => {
    try {
        let userId = req.query.userId;
        let data = await cartApiService.readFunc(userId);
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

const addToCart = async (req, res) => {
    try {
        let data = await cartApiService.addToCart(req.body);
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

// const getAllProductByCartId = async (req, res) => {
//     try {
//         let cartId = req.query.cartId;
//         let data = await cartApiService.getAllProductByCartId(cartId);
//         return res.status(200).json({
//             EM: data.EM,
//             EC: data.EC,
//             DT: data.DT,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             EM: 'error from server',
//             EC: '-1',
//             DT: '',
//         });
//     }
// };

const getAllProductByCartId = async(req, res) => {
    try {
        let cartId = req.query.cartId;
        let data = await cartApiService.getAllProductByCartId(cartId);
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

const updateFunc = async (req, res)=>{
    try {
        let data = await cartApiService.updateFunc(req.body);
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

const updateIsChecked = async (req, res) => {
    try {
        let data = await cartApiService.updateIsChecked(req.body);
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

const deleteFunc = async (req, res) => {
    try {
        let data = await cartApiService.deleteFunc(req.query.cartId, req.query.productId);
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

const deleteCartProduct = async (req, res) => {
    try {
        let data = await cartApiService.deleteCartProducts(req.query.data);
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

module.exports = {
    createFunc,
    readFunc,
    addToCart,
    getAllProductByCartId,
    getAllProductByCartId,
    updateFunc,
    deleteFunc,
    updateIsChecked,
    deleteCartProduct
};
