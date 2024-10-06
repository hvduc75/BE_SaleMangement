import authService from "../service/authService";

const handleLogin = async (req, res) => {
  try {
    let data = await authService.handleUserLogin(req.body);
    // set cookie
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
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

const handleRegister = async (req, res) => {
  try {
    let data = await authService.handleUserRegister(req.body);
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

const handleLogout = async (req, res) => {
  try {
    res.clearCookie("jwt")
    return res.status(200).json({
      EM: "clear cookies done!", 
      EC: 0,
      DT: '',
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

const handleRefreshToken = async (req, res) => {
  try {
    let data = await authService.handleRefreshToken(req.body);
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
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefreshToken
};
