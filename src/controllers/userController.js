import userApiService from "../service/userApiService";

const createFunc = async (req, res) => {
  try {
    console.log(req.body)
    let data = await userApiService.createNewUser(req.body);
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

module.exports = {
  createFunc,
};
