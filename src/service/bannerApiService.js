import db from "../models";

const createBanner = async (data) => {
  try {
    if (!data.image || !data.name || !data.status) {
      return {
        EM: "Error with empty Input",
        EC: 1,
        DT: "",
      };
    }
    if (data.status == 1) {
      let data = await getBannersWithStatus(true);
      if (data.DT.length >= 6) {
        return {
          EM: "The number of active banners cannot be greater than 6",
          EC: 2,
          DT: "",
        };
      }
    }
    await db.Banner.create({
      name: data.name,
      description: data.description,
      status: data.status,
      image: data.image,
    });

    return {
      EM: "Create Banner succeeds",
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

const getAllBanner = async () => {
  try {
    let banners = await db.Banner.findAll({
      attributes: ["id", "name", "description", "status", "image"],
    });
    if (banners) {
      return {
        EM: "Get data success",
        EC: 0,
        DT: banners,
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
};

const getBannerWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Banner.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "name", "description", "status", "image"],
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      banners: rows,
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

const getBannersWithStatus = async (status) => {
  try {
    let data = await db.Banner.findAll({
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

const updateBanner = async (data) => {
  try {
    if (!data.name || !data.status) {
      return {
        EM: "Error with empty Input",
        EC: 1,
        DT: "",
      };
    }
    let banner = await db.Banner.findOne({
      where: {
        id: data.id,
      },
    });

    if (banner) {
      const currentStatus = banner.status;
      const newStatus = data.status;
      // Nếu đang chuyển trạng thái từ false sang true
      if (newStatus && !currentStatus) {
        let data = await getBannersWithStatus(true);
        if (data.DT.length >= 6) {
          return {
            EM: "The number of banners cannot be greater than 6",
            EC: 1,
            DT: "",
          };
        }
      }
      // Nếu đang chuyển trạng thái từ true sang false
      else if (newStatus && currentStatus) {
        let data = await getBannersWithStatus(true); 
        if (data.DT.length <= 4) {
          return {
            EM: "The number of active banners cannot be less than 4",
            EC: 1,
            DT: "",
          };
        }
      }
      await banner.update({
        name: data.name,
        description: data.description,
        status: newStatus,
        image: data.image,
      });

      return {
        EM: "Update Banner succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Banner not found",
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

const deleteBanner = async (bannerId) => {
  try {
    let banner = await db.Banner.findOne({
      where: {
        id: bannerId,
      },
    });

    if (banner) {
      if (banner.status == 1) {
        let data = await getBannersWithStatus(true);
        if (data.DT.length <= 4) {
          return {
            EM: "The number of active banners cannot be less than 4",
            EC: 2,
            DT: "",
          };
        }
      }

      await banner.destroy();

      return {
        EM: "Delete Banner succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Banner not found",
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
  createBanner,
  getAllBanner,
  getBannerWithPagination,
  getBannersWithStatus,
  updateBanner,
  deleteBanner,
};
