import db from '../models';
import { Op } from 'sequelize';

const createFunc = async (data) => {
    try {
        if (
            !data.userName ||
            !data.phone ||
            !data.province ||
            !data.district ||
            !data.commune ||
            !data.address ||
            !data.typeAddress ||
            data.isDefault === null ||
            data.isDefault === undefined ||
            !data.userId
        ) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }

        let userInfo = await db.User_Infor.findOne({
            where: {
                [Op.and]: [{ isDefault: true }, { userId: data.userId }],
            },
        });

        if (userInfo) {
            if (data.isDefault) {
                await userInfo.update({
                    isDefault: false,
                });
            }
        } else {
            await db.User_Infor.create({
                userName: data.userName,
                phone: data.phone,
                province: data.province,
                district: data.district,
                commune: data.commune,
                address: data.address,
                typeAddress: data.typeAddress,
                isDefault: true,
                isDeleted: false,
                userId: data.userId,
            });
            return {
                EM: 'Create User Information succeeds',
                EC: 0,
                DT: '',
            };
        }
        await db.User_Infor.create({
            userName: data.userName,
            phone: data.phone,
            province: data.province,
            district: data.district,
            commune: data.commune,
            address: data.address,
            typeAddress: data.typeAddress,
            isDefault: data.isDefault,
            isDeleted: false,
            userId: data.userId,
        });

        return {
            EM: 'Create User Information succeeds',
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

const getUserInforDefault = async (userId) => {
    try {
        let data = await db.User_Infor.findOne({
            where: {
                [Op.and]: [{ isDefault: true }, { userId: userId }],
            },
        });
        return {
            EM: 'Get Data Success',
            EC: 0,
            DT: data,
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

const getListUserInfo = async (userId) => {
    try {
        let data = await db.User_Infor.findAll({
            where: {
                [Op.and]: [{ isDeleted: false }, { userId: userId }],
            },
            attributes: [
                'id',
                'province',
                'district',
                'address',
                'userName',
                'phone',
                'commune',
                'typeAddress',
                'isDefault',
                'isDeleted',
            ],
        });
        return {
            EM: 'Get Data Success',
            EC: 0,
            DT: data,
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

const updateUserInfo = async (data) => {
    try {
        if (
            !data.userName ||
            !data.phone ||
            !data.id ||
            !data.province ||
            !data.district ||
            !data.commune ||
            !data.address ||
            !data.typeAddress ||
            data.isDefault === null ||
            data.isDefault === undefined ||
            !data.userId
        ) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        let userInfoDefault = await db.User_Infor.findOne({
            where: {
                [Op.and]: [{ isDefault: true }, { userId: data.userId }],
            },
        });

        if (userInfoDefault) {
            if (data.isDefault) {
                await userInfoDefault.update({
                    isDefault: false,
                });
            }
        }

        if (data.Selected === 'ChooseAddress') {
            await userInfoDefault.update({
                isDefault: false,
            });
        }

        let userInfo = await db.User_Infor.findOne({
            where: { id: data.id },
        });

        if (userInfo) {
            if (data.Selected === 'ChooseAddress') {
                await userInfo.update({
                    isDefault: true,
                });
                return {
                    EM: 'Choose User Info Success',
                    EC: 0,
                    DT: '',
                };
            }

            if (data.Selected === 'DeleteAddress') {
                await userInfo.update({
                    isDeleted: true,
                });
                return {
                    EM: 'Delete User Info Success',
                    EC: 0,
                    DT: '',
                };
            }

            await userInfo.update({
                userName: data.userName,
                phone: data.phone,
                province: data.province,
                district: data.district,
                commune: data.commune,
                address: data.address,
                typeAddress: data.typeAddress,
                isDefault: userInfo.isDefault !== true ? data.isDefault : true,
                userId: data.userId,
            });
            return {
                EM: 'Update User Info Success',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User Info Not Found',
                EC: 1,
                DT: '',
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
    createFunc,
    getUserInforDefault,
    getListUserInfo,
    updateUserInfo,
};
