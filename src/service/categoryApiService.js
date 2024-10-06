import db from "../models";

const createCategory = async (data) => {
  try {
    if (!data.image || !data.name || !data.hot) {
      return {
        EM: "Error with empty Input",
        EC: 1,
        DT: "",
      };
    }
    await db.Category.create({
      name: data.name,
      description: data.description,
      hot: data.hot,
      image: data.image,
    });

    return {
      EM: "Create category succeeds",
      EC: 0,
      DT: "",
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

const getAllCategory = async () => {
  try {
    let categories = await db.Category.findAll({
      attributes: ["id", "name", "description", "hot", "image"],
    });
    if (categories) {
      return {
        EM: "Get data success",
        EC: 0,
        DT: categories,
      };
    } else {
      return {
        EM: "Get data success",
        EC: 1,
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
};

const getCategoryWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Category.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "name", "description", "hot", "image"],
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      categories: rows,
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

const getCategoriesWithStatus = async (status) => {
  try {
    let data = await db.Category.findAll({
      where: { status: status },
      attributes: ["name", "description", "image"],
    });
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

const updateCategory = async (data) => {
  try {
    if (!data.name || !data.hot) {
      return {
        EM: "Error with empty Input",
        EC: 1,
        DT: "",
      };
    }
    let Category = await db.Category.findOne({
      where: {
        id: data.id,
      },
    });

    if (Category) {
      await Category.update({
        name: data.name,
        description: data.description,
        hot: data.hot,
        image: data.image,
      });

      return {
        EM: "Update category succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Category not found",
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

const deleteCategory = async (CategoryId) => {
  try {
    let category = await db.Category.findOne({
      where: {
        id: CategoryId,
      },
    });

    if (category) {
      await category.destroy();
      return {
        EM: "Delete category succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Category not found",
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

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryWithPagination,
  getCategoriesWithStatus,
  updateCategory,
  deleteCategory,
};
