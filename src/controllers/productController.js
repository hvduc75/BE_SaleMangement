import productApiService from '../service/productApiService';

const createFunc = async (req, res) => {
    try {
        // Lấy danh sách hình ảnh và nền từ req.files
        const images = req.files['image']; // Hình ảnh
        const backgrounds = req.files['background']; // Nền

        // Kiểm tra và chuyển đổi các trường trong req.body thành mảng nếu chúng không phải là mảng
        const { name, price, sale, quantity, categoryId } = req.body;

        // Đảm bảo mỗi trường đều là một mảng (nếu không thì chuyển thành mảng)
        const productNames = Array.isArray(name) ? name : [name];
        const productPrices = Array.isArray(price) ? price : [price];
        const productSales = Array.isArray(sale) ? sale : [sale];
        const productQuantities = Array.isArray(quantity) ? quantity : [quantity];
        const productCategoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];

        // Tạo mảng sản phẩm dựa trên các trường đã được chuyển đổi
        const products = productNames.map((_, index) => ({
            name: productNames[index],
            price: productPrices[index],
            sale: productSales[index],
            quantity: productQuantities[index],
            categoryId: productCategoryIds[index],
            // Lấy hình ảnh và nền tương ứng cho từng sản phẩm
            image: images && images[index] ? images[index].buffer : null,
            background: backgrounds && backgrounds[index] ? backgrounds[index].buffer : null,
        }));

        // Gọi API service để tạo sản phẩm
        let data = await productApiService.createNewProducts(products);

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

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit && req.query.categoryId) {
            let page = req.query.page;
            let limit = req.query.limit;
            let categoryId = req.query.categoryId;

            let data = await productApiService.getProductWithPagination(+page, +limit, +categoryId);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (req.query.query) {
            let query = req.query.query;
            let data = await productApiService.getProductWithSearchText(query);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        let data = await productApiService.getAllProducts();
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

const getProductById = async (req, res) => {
    try {
        let productId = req.query.productId;
        let data = await productApiService.getProductById(productId);
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

const getAllProducts = async (req, res) => {
    try {
        let condition = req.query.condition;
        if (condition === 'TopDeal') {
            let data = await productApiService.getAllProductWithCondition(condition);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (condition === 'ProductInterest') {
            let userId = req.query.id;
            let data = await productApiService.getAllProductWithCondition(condition, userId);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (condition === 'productFavorite') {
            let data = await productApiService.getAllProductWithCondition(condition);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
        if (condition === 'productWithPaginate') {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await productApiService.getProductWithPagination(page, limit);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Error from server',
            EC: '-1',
            DT: '',
        });
    }
};

const getProductsByCategoryId = async (req, res) => {
    try {
        let categoryId = req.query.categoryId;
        let data = await productApiService.getProductsByCategoryId(categoryId);
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

const updateFunc = async (req, res) => {
    try {
        req.body.image = req.files['image'] ? req.files['image'][0].buffer : null;
        req.body.background = req.files['background'] ? req.files['background'][0].buffer : null;
        let data = await productApiService.updateProduct(req.body);
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

const deleteFunc = async (req, res) => {
    try {
        let data = await productApiService.deleteProduct(req.body.id);
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

const createUserProduct = async (req, res) => {
    try {
        console.log(req.body);
        let data = await productApiService.createUserProduct(req.body);
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

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    deleteFunc,
    getAllProducts,
    createUserProduct,
    getProductById,
    getProductsByCategoryId,
};
