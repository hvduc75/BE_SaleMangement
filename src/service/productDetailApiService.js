import db from '../models';

const getProductDetail = async (id) => {
    console.log(id);
    try {
        let data = await db.ProductDetail.findOne({
            where: { productId: id },
            attributes: ['id', 'description', 'contentMarkdown', 'productId'],
        });
        return {
            EM: 'Get Product Detail success',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with the services",
            EC: 1,
            DT: [],
        };
    }
};

const createUpdateProductDetail = async (data) => {
    try {
        if (!data.description || !data.contentMarkdown || !data.productId || !data.action) {
            return {
                EM: 'Missing parameter',
                EC: 1,
                DT: [],
            };
        }
        if (data.action === 'Create') {
            await db.ProductDetail.create({
                description: data.description,
                contentMarkdown: data.contentMarkdown,
                productId: data.productId,
            });
            return {
                EM: 'Create Product Detail success',
                EC: 0,
                DT: [],
            };
        } else {
            let productDetail = await db.ProductDetail.findOne({
                where: { productId: data.productId },
            });
            if (productDetail) {
                productDetail.description = data.description;
                productDetail.contentMarkdown = data.contentMarkdown;
                await productDetail.save();
            }
            return {
                EM: 'Save Product Detail success',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with the services",
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    createUpdateProductDetail,
    getProductDetail,
};
