import db from '../models';

const getProductDetail = async (id) => {
    console.log(id);
    try {
        let data = await db.Product.findOne({
            where: { id: id },
            attributes: ['id'],
            include: [
                {
                    model: db.ProductImage,
                    attributes: ['image'],
                },
                {
                    model: db.ProductDetail,
                    attributes: ['id', 'description', 'contentMarkdown'],
                },
            ],
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

            const convertedProductImages = data.images.map((image) => ({
                image: image.image,
                productId: data.productId,
            }));
            await db.ProductImage.bulkCreate(convertedProductImages);

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

            await db.ProductImage.destroy({
                where: { productId: data.productId },
            });

            const convertedProductImages =
                data.images &&
                data.images.map((image) => ({
                    image: image.image,
                    productId: data.productId,
                }));
            if (convertedProductImages) {
                await db.ProductImage.bulkCreate(convertedProductImages);
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
