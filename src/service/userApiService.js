import db from "../models";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });
  if (user) {
    return true;
  }
  return false;
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true;
  }
  return false;
};

const createNewUser = async (data) => {
  try {
    let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist) {
      return {
        EM: "The email is already exist",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await checkPhoneExist(data.phone);
    if (isPhoneExist) {
      return {
        EM: "The phone number is already exist",
        EC: 1,
        DT: "phone",
      };
    }
    let hashPassword = hashUserPassword(data.password);
    await db.User.create({ ...data, hashPassword });
    return {
        EM: "Create User Success",
        EC: 0,
        DT: [],
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

module.exports = {
    createNewUser
}