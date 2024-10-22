import db from '../models';
import { Op } from 'sequelize';

const createFunc = async (data) => {
    try {
        if (
            !data.province ||
            !data.district ||
            !data.commune ||
            !data.address ||
            !data.typeAddress ||
            !data.isDefault ||
            !data.userId
        ) {
            return {
                EM: 'Error with empty Input',
                EC: 1,
                DT: '',
            };
        }
        let userInfo = await db.User_Infor.findOne({
            where: { isDefault: true },
        });

        if(userInfo){
            return {
                EM: 'Can Not Make User Info',
                EC: 1,
                DT: '',
            };
        }
        await db.User_Infor.create({
            province: data.province,
            district: data.district,
            commune: data.commune,
            address: data.address,
            typeAddress: data.typeAddress,
            isDefault: data.isDefault,
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

module.exports = {
    createFunc,
    getUserInforDefault,
};
