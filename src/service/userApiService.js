import db from '../models';
import bcrypt from 'bcryptjs';
const { Op, literal } = require('sequelize');

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
                EM: 'The email is already exist',
                EC: 1,
                DT: 'email',
            };
        }
        let isPhoneExist = await checkPhoneExist(data.phone);
        if (isPhoneExist) {
            return {
                EM: 'The phone number is already exist',
                EC: 1,
                DT: 'phone',
            };
        }
        let hashPassword = hashUserPassword(data.password);
        await db.User.create({
            ...data,
            password: hashPassword,
            avatar: data.image,
        });
        return {
            EM: 'Create User Success',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone', 'address'],
            include: { model: db.Group, attributes: ['name', 'description'] },
        });
        if (users) {
            return {
                EM: 'Get data success',
                EC: 0,
                DT: users,
            };
        } else {
            return {
                EM: 'Get data success',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const getUserById = async (userId) => {
    try {
        let users = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email', 'phone', 'address', 'birthDay', 'avatar', 'sex'],
        });
        if (users) {
            return {
                EM: 'Get data success',
                EC: 0,
                DT: users,
            };
        } else {
            return {
                EM: 'Get data success',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const getAllUserByWeek = async (startDate) => {
    try {
        const startOfWeek = new Date(startDate);
        startOfWeek.setHours(0, 0, 0, 0); 

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); 
        endOfWeek.setHours(23, 59, 59, 999); 

        let users = await db.User.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfWeek, endOfWeek], 
                },
            },
        });

        return {
            EM: 'Ok',
            EC: 0,
            DT: users,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong with services',
            EC: 1,
            DT: [],
        };
    }
};

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'groupId', 'address', 'avatar'],
            include: { model: db.Group, attributes: ['name', 'description'] },
            order: [['id', 'DESC']],
        });

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows,
        };

        return {
            EM: 'Ok',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const updateUser = async (data) => {
    try {
        if (!data.groupId) {
            return {
                EM: 'Error with empty GroupId',
                EC: 1,
                DT: '',
            };
        }
        let user = await db.User.findOne({
            where: {
                id: data.id,
            },
        });
        if (user) {
            await user.update({
                username: data.username,
                address: data.address,
                groupId: data.groupId,
                avatar: data.image,
            });
            return {
                EM: 'Update user succeeds',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User not found',
                EC: 2,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const updateProfile = async (data) => {
    try {
        if (!data.id) {
            return {
                EM: 'Error Empty Input',
                EC: 1,
                DT: '',
            };
        }
        let user = await db.User.findOne({
            where: {
                id: data.id,
            },
        });
        if (user) {
            await user.update({
                username: data.username ? data.username : user.username,
                sex: data.gender ? data.gender : user.sex,
                birthDay: data.birthDay ? data.birthDay : user.birthDay,
                avatar: data.avatar ? data.avatar : user.avatar,
            });
            return {
                EM: 'Update user succeeds',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User not found',
                EC: 2,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

const deleteUser = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
        });
        if (user) {
            await user.destroy();
            return {
                EM: 'Delete user succeeds',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'User not exist',
                EC: 2,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'somethings wrongs with services',
            EC: 1,
            DT: [],
        };
    }
};

module.exports = {
    createNewUser,
    getAllUser,
    getUserWithPagination,
    updateUser,
    deleteUser,
    checkEmailExist,
    checkPhoneExist,
    hashUserPassword,
    updateProfile,
    getUserById,
    getAllUserByWeek
};
