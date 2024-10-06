import categoryApiService from "../service/categoryApiService";

const createFunc = async (req, res) => {
  try {
    req.body.image = req.file ? req.file.buffer : null;
    let data = await categoryApiService.createCategory(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await categoryApiService.getCategoryWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } 
    if(req.query.hot) {
      let hot = req.query.hot;
      let data = await categoryApiService.getCategoryWithStatus(hot);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
    else {
      let data = await categoryApiService.getAllCategory();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    req.body.image = req.file ? req.file.buffer : null;
    let data = await categoryApiService.updateCategory(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

const deleteFunc = async (req, res) => {
  try {
    let data = await categoryApiService.deleteCategory(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

module.exports = {
  createFunc,
  readFunc,
  updateFunc,
  deleteFunc
};
