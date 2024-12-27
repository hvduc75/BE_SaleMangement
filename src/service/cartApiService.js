import db from '../models';
import { Op } from 'sequelize';

const createFunc = async (userId) => {
    try {
        let cart = await db.Cart.findOne({
            where: { userId: userId },
        });
        if (cart) {
            return {
                EM: 'shopping cart already exists',
                EC: 1,
                DT: '',
            };
        }
        await db.Cart.create({
            userId: userId,
        });
        return {
            EM: 'Create Cart succeeds',
            EC: 0,
            DT: '',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const readFunc = async (userId) => {
    try {
        if (!userId) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let cart = await db.Cart.findOne({
            where: { userId: userId },
        });
        if (!cart) {
            return {
                EM: 'Cart not found!',
                EC: 1,
                DT: [],
            };
        }
        return {
            EM: 'Ok',
            EC: 0,
            DT: cart,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

// const getAllProductByCartId = async (cartId) => {
//     try {
//         let products = await db.Cart.findAll({
//             where: { id: cartId },
//             attributes: ['userId'],
//             include: [
//                 {
//                     model: db.Product,
//                     attributes: [
//                         'id',
//                         'name',
//                         'price',
//                         'sale',
//                         'image',
//                         'price_current',
//                         'background',
//                         'quantity_current',
//                         'quantity_sold',
//                     ],
//                     through: { attributes: ['quantity'] },
//                 },
//             ],
//         });
//         return {
//             EM: 'Get data success',
//             EC: 0,
//             DT: products,
//         };
//     } catch (error) {
//         console.log(error);
//         return {
//             EM: "Something's wrong with services",
//             EC: 1,
//             DT: [],
//         };
//     }
// };

const getAllProductByCartId = async (cartId) => {
    try {
        let products = await db.Cart.findAll({
            where: { id: cartId },
            attributes: ['userId'],
            include: [
                {
                    model: db.Product,
                    attributes: [
                        'id',
                        'name',
                        'price',
                        'sale',
                        'image',
                        'price_current',
                        'background',
                        'quantity_current',
                        'quantity_sold',
                    ],
                    through: {
                        // where: { isChecked: true },
                        attributes: ['quantity', 'isChecked'],
                    },
                },
            ],
        });
        return {
            EM: 'Get data success',
            EC: 0,
            DT: products,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const addToCart = async (data) => {
    try {
        if (!data.cartId || !data.productId || !data.quantity) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let productCart = await db.Product_Cart.findOne({
            where: {
                [Op.and]: [{ cartId: data.cartId }, { productId: data.productId }],
            },
        });
        let product = await db.Product.findOne({
            where: {
                id: data.productId,
            },
        });
        let productQuantity = product.quantity_current;
        if (productCart) {
            if (productCart.quantity + data.quantity > productQuantity) {
                return {
                    EM: `Số lượng sản phẩm tồn kho không đủ, hiện đang có ${productQuantity} sản phẩm`,
                    EC: 1,
                    DT: [],
                };
            }
            await productCart.update({
                quantity: productCart.quantity + data.quantity,
            });
            return {
                EM: 'Added to cart successfully',
                EC: 0,
                DT: [],
            };
        }
        if (data.quantity > productQuantity) {
            return {
                EM: `Số lượng sản phẩm tồn kho không đủ, hiện đang có ${productQuantity} sản phẩm`,
                EC: 1,
                DT: [],
            };
        }
        await db.Product_Cart.create({
            cartId: data.cartId,
            productId: data.productId,
            quantity: data.quantity,
        });
        return {
            EM: 'Added to cart successfully',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const updateFunc = async (data) => {
    try {
        if (!data.cartId || !data.productId || !data.quantity) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let productCart = await db.Product_Cart.findOne({
            where: {
                [Op.and]: [{ cartId: data.cartId }, { productId: data.productId }],
            },
        });
        if (productCart) {
            let product = await db.Product.findOne({
                where: {
                    id: data.productId,
                },
            });
            let productQuantity = product.quantity_current;
            if (data.quantity > productQuantity) {
                return {
                    EM: 'Số lượng sản phẩm tồn kho không đủ',
                    EC: 1,
                    DT: [],
                };
            }
            await productCart.update({
                quantity: data.quantity,
            });
            return {
                EM: 'Update Quantity Product Success',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'ProductCart not found',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const updateIsChecked = async (data) => {
    try {
        if (!data.cartId || !data.productId || data.isChecked === undefined) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let productCart = await db.Product_Cart.findOne({
            where: {
                [Op.and]: [{ cartId: data.cartId }, { productId: data.productId }],
            },
        });
        if (productCart) {
            // console.log(data)
            await productCart.update({
                isChecked: data.isChecked,
            });
            return {
                EM: 'Update IsChecked Success',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'ProductCart not found',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const deleteFunc = async (cartId, productId) => {
    try {
        if (!cartId || !productId) {
            return {
                EM: 'Input is Empty',
                EC: 1,
                DT: [],
            };
        }
        let productCart = await db.Product_Cart.findOne({
            where: {
                [Op.and]: [{ cartId: cartId }, { productId: productId }],
            },
        });
        if (productCart) {
            await productCart.destroy();
            return {
                EM: 'Delete Product In Cart Success',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'ProductCart not found',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

const deleteCartProducts = async (data) => { 
    try {
        if (!data.cartId || !data.products) {
            return {
                EM: 'Input is Empty or Invalid',
                EC: 1,
                DT: [],
            };
        }

        const deleteResults = [];
        let hasError = false; // Cờ báo lỗi

        for (let product of data.products) {
            let productCart = await db.Product_Cart.findOne({
                where: {
                    [Op.and]: [{ cartId: data.cartId }, { productId: product.id }],
                },
            });

            if (!productCart) {
                deleteResults.push({
                    productId: product.id,
                    message: 'ProductCart not found',
                    success: false,
                });
                hasError = true;
                continue;
            }

            let productUpdate = await db.Product.findOne({
                where: { id: product.id },
            });

            if (productUpdate.quantity_current < product.quantity) {
                // Sản phẩm không đủ số lượng
                await productCart.update({
                    quantity: productUpdate.quantity_current,
                });
                deleteResults.push({
                    productId: product.id,
                    message: 'Not enough stock, updated quantity in cart',
                    success: false,
                });
                hasError = true;
                continue;
            }

            if (productUpdate.quantity_current === 0) {
                // Sản phẩm hết hàng
                await productCart.destroy();
                deleteResults.push({
                    productId: product.id,
                    message: 'Product is out of stock, removed from cart',
                    success: false,
                });
                hasError = true;
                continue;
            }

            // Giảm số lượng tạm thời
            await productUpdate.update({
                quantity_current: productUpdate.quantity_current - product.quantity,
                quantity_sold: (Number(productUpdate.quantity_sold) || 0) + Number(product.quantity),
            });                              

            await productCart.destroy();
            deleteResults.push({
                productId: product.id,
                message: 'Delete Product In Cart Success',
                success: true,
            });
        }

        return {
            EM: hasError ? 'Some products had issues' : 'Delete Products In Cart Processed',
            EC: hasError ? 1 : 0,
            DT: deleteResults,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something's wrong with services",
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    createFunc,
    readFunc,
    addToCart,
    updateFunc,
    deleteFunc,
    updateIsChecked,
    getAllProductByCartId,
    deleteCartProducts,
};
