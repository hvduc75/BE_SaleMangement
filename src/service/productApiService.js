import db, { sequelize } from "../models";
import { Op } from "sequelize";

const createNewProducts = async (products) => {
  try {
    if (!Array.isArray(products)) {
      products = [products];
    }

    for (const product of products) {
      if (
        !product.name ||
        !product.price ||
        !product.image ||
        !product.background ||
        !product.quantity
      ) {
        return {
          EM: "Error input is Empty!",
          EC: 2,
          DT: [],
        };
      }
    }

    const convertedProducts = products.map((product) => ({
      name: product.name,
      price: product.price,
      price_current: product.price * (1 - product.sale / 100),
      sale: product.sale,
      image: product.image,
      background: product.background,
      quantity_current: product.quantity,
      categoryId: product.categoryId,
    }));

    const createdProducts = await db.Product.bulkCreate(convertedProducts);

    return {
      EM: `Create products succeeds ${createdProducts.length} products...`,
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Somethings wrong with services",
      EC: 1,
      DT: [],
    };
  }
};

const getProductWithPagination = async (page, limit, categoryId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "name",
        "price",
        "sale",
        "quantity_current",
        "image",
        "background",
      ],
      where: { categoryId: categoryId },
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      products: rows,
    };

    return {
      EM: "Ok",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "somethings wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getAllProductWithCondition = async (condition, userId)=> {
  try {
    let products;
    if(condition === "TopDeal"){
      products = await db.Product.findAll({
        attributes: ["id", "name", "price", "sale", "image", "price_current", "background", "quantity_current", "quantity_sold"],
        limit : 48,
        order: [["quantity_sold", "DESC"]],
      });
    } 
    if (condition === "ProductInterest") {
      products = await db.User.findAll({
        where: { id: userId },
        attributes: [
          "id",
          "username",
          "email",
        ],
        include: [
          {
            model: db.Product, 
            attributes: [
              "id",
              "name",
              "price",
              "sale",
              "image",
              "price_current",
              "background",
              "quantity_current",
              "quantity_sold",
            ],
            through: { attributes: ["viewNum"] },
          },
        ],
        limit: 48,
        // order: [[db.User_Product, "viewNum", "DESC"]],
      });
    }

    if(condition === "productFavorite"){
      products = await db.Product.findAll({
        attributes: ["id", "name", "price", "sale", "image", "price_current", "background", "quantity_current", "quantity_sold"],
        order: sequelize.random(),
        limit : 48,
      });
    }
    
    if (products) {
      return {
        EM: "Get data success",
        EC: 0,
        DT: products,
      };
    } else {
      return {
        EM: "Get data success",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "somethings wrongs with services",
      EC: 1,
      DT: [],
    };
  }
}

const updateProduct = async (data) => {
  console.log(data);
  try {
    if (
      !data.name ||
      !data.price ||
      !data.quantity ||
      !data.categoryId
    ) {
      return {
        EM: "Error input is Empty!",
        EC: 2,
        DT: [],
      };
    }
    let product = await db.Product.findOne({
      where: {
        id: data.id,
      },
    });

    if (product) {
      let updateData = {
        name: data.name,
        price: data.price,
        price_current: data.sale ? data.price * (1 - data.sale / 100) : null,
        sale: data.sale ? data.sale : null,
        quantity: data.quantity,
        categoryId: data.categoryId,
      };
      if (data.image !== null && data.image !== undefined) {
        updateData.image = data.image;
      }
      if (data.background !== null && data.background !== undefined) {
        updateData.background = data.background;
      }
      await product.update(updateData);
      return {
        EM: "Update Product succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Product not found",
        EC: 2,
        DT: "",
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

const deleteProduct = async (id) => {
  try {
    let product = await db.Product.findOne({
      where: {
        id: id,
      },
    });

    if (product) {
      await product.destroy();
      return {
        EM: "Delete Product succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Product not found",
        EC: 3,
        DT: "",
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

const createUserProduct = async (data) => {
  try {
    if(!data.userId || !data.productId) {
      return {
        EM: "Error input is Empty!",
        EC: 0,
        DT: [],
      };
    }

    let userProduct = await db.User_Product.findOne({
      where: {[Op.and]: [{ userId: data.userId }, { productId: data.productId }]},
    })

    if(userProduct) {
      await userProduct.update(
        {viewNum: +userProduct.viewNum+1}
      );
      return {
        EM: "Update User Product success",
        EC: 0,
        DT: [],
      };
    }

    await db.User_Product.create({
      userId: data.userId,
      productId: data.productId,
      viewNum: 1
    })
    return {
      EM: "Create User Product success",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something's wrong with the services",
      EC: 1,
      DT: [],
    };
  }
}

module.exports = {
  createNewProducts,
  getProductWithPagination,
  updateProduct,
  deleteProduct,
  getAllProductWithCondition,
  createUserProduct
};
