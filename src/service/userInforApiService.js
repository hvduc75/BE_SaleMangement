import db from '../models';

const createFunc = async (data) => {
    try {
        if (!data.province || !data.district || !data.commune || !data.address || !data.typeAddress || !data.isDefault || !data.userId) {
            return {
                EM: 'Error with empty Input',
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
            userId: data.userId
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

module.exports = {
    createFunc,
};
