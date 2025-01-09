import db from '../models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
const { v4: uuidv4 } = require('uuid');

import { checkEmailExist, checkPhoneExist, hashUserPassword } from './userApiService';
import { createFunc } from '../service/cartApiService';
import { getGroupWithRoles } from './JWTService';
import { createJWT, verifyToken } from '../middleware/JWTAction';

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const handleUserLogin = async (data) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [{ email: data.valueLogin }, { phone: data.valueLogin }],
            },
        });

        if (user) {
            let isCorrectPassword = checkPassword(data.password, user.password);
            if (isCorrectPassword) {
                let groupWithRoles = await getGroupWithRoles(user);
                let payload = {
                    email: user.email,
                    groupWithRoles,
                    username: user.name,
                };

                let access_token = createJWT(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET,
                    process.env.ACCESS_TOKEN_EXPIRES_IN,
                );

                let refresh_token = createJWT(
                    payload,
                    process.env.REFRESH_TOKEN_SECRET,
                    process.env.REFRESH_TOKEN_EXPIRES_IN,
                );

                let refresh_expired = new Date();
                refresh_expired.setDate(refresh_expired.getDate() + 2);

                await user.update({ refresh_token, refresh_expired });

                // kiem tra de tao cart
                await createFunc(user.id);

                return {
                    EM: 'Ok',
                    EC: 0,
                    DT: {
                        access_token: access_token,
                        refresh_token: refresh_token,
                        groupWithRoles: groupWithRoles,
                        role: groupWithRoles.name,
                        email: user.email,
                        phone: user.phone,
                        username: user.username,
                        id: user.id,
                        avatar: user.avatar,
                        gender: user.sex,
                        birthDay: user.birthDay,
                    },
                };
            }
        }
        return {
            EM: 'Your email/phone number or password is incorrect!',
            EC: 1,
            DT: '',
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs is service...',
            EC: -2,
            DT: [],
        };
    }
};

const handleUserRegister = async (data) => {
    try {
        // check email/phonenumber are exist
        let isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist) {
            return {
                EM: 'The email is already exist',
                EC: 1,
            };
        }
        let isPhoneExist = await checkPhoneExist(data.phone);
        if (isPhoneExist) {
            return {
                EM: 'The phone number is already exist',
                EC: 1,
            };
        }
        // has user password
        let hashPassword = hashUserPassword(data.password);

        // create new user
        await db.User.create({
            email: data.email,
            username: data.username,
            password: hashPassword,
            phone: data.phone,
            groupId: 1,
        });

        return {
            EM: 'A user is created successfully!',
            EC: 0,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrongs is service',
            EC: -2,
        };
    }
};

const handleRefreshToken = async (data) => {
    try {
        const refresh_token = data.refresh_token;
        const decoded = verifyToken(refresh_token, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded) {
            return {
                EM: 'Refresh token is invalid',
                EC: 1,
                DT: '',
            };
        }

        const user = await db.User.findOne({
            where: { email: decoded.email },
        });

        if (user) {
            if (new Date() < user.refresh_expired) {
                const payload = {
                    email: user.email,
                    username: user.username,
                    groupWithRoles: decoded.groupWithRoles,
                };

                const access_token = createJWT(
                    payload,
                    process.env.ACCESS_TOKEN_SECRET,
                    process.env.ACCESS_TOKEN_EXPIRES_IN,
                );

                return {
                    EM: 'Access token refreshed successfully',
                    EC: 0,
                    DT: {
                        access_token: access_token,
                    },
                };
            } else {
                return {
                    EM: 'Refresh token has expired. Please log in again',
                    EC: 1,
                    DT: '',
                };
            }
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong in the service',
            EC: -2,
            DT: [],
        };
    }
};

const upsertUserSocialMedia = async (typeAcc, dataRaw) => {
    try {
        let user = null;
        const tokenLogin = uuidv4();
        user = await db.User.findOne({
            where: {
                email: dataRaw.email,
            },
        });
        if (!user) {
            user = await db.User.create({
                email: dataRaw.email,
                username: dataRaw.username,
                groupId: 1,
                type: typeAcc,
                tokenLogin: tokenLogin,
            });
        }
        let groupWithRoles = await getGroupWithRoles(user);
        let payload = {
            email: user.email,
            groupWithRoles,
            username: user.name,
        };

        let refresh_token = createJWT(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN);

        let refresh_expired = new Date();
        refresh_expired.setDate(refresh_expired.getDate() + 2);

        await user.update({ refresh_token, refresh_expired, tokenLogin });
        await createFunc(user.id);
        return user;
    } catch (error) {
        console.log(error);
    }
};

const checkTokenLogin = async (userId, tokenLogin) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId, tokenLogin: tokenLogin },
        });

        if (user) {
            let newTokenLogin = uuidv4();
            user.update({ tokenLogin: newTokenLogin });

            let groupWithRoles = await getGroupWithRoles(user);
            let payload = {
                email: user.email,
                groupWithRoles,
                username: user.name,
            };

            let access_token = createJWT(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES_IN);

            return {
                EM: 'Ok',
                EC: 0,
                DT: {
                    access_token: access_token,
                    refresh_token: user.refresh_token,
                    groupWithRoles: groupWithRoles,
                    role: groupWithRoles.name,
                    email: user.email,
                    phone: user.phone,
                    username: user.username,
                    id: user.id,
                    avatar: user.avatar,
                    gender: user.sex,
                    birthDay: user.birthDay,
                },
            };
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong in the service',
            EC: -2,
            DT: [],
        };
    }
};

const checkUserWithEmail = async (email) => {
    try {
        const user = await db.User.findOne({
            where: { email: email, type: 'LOCAL' },
        });

        if (user) {
            return {
                EM: 'Find User Success',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong in the service',
            EC: -2,
            DT: [],
        };
    }
};

const updateUserCode = async (email, otp) => {
    try {
        const user = await db.User.findOne({
            where: { email: email, type: 'LOCAL' },
        });

        if (user) {
            await user.update({ code: otp });
            return {
                EM: 'Update User Code Success',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong in the service',
            EC: -2,
            DT: [],
        };
    }
};

const resetPassword = async (data) => {
    if (!data.email || !data.otp || !data.password) {
        return {
            EM: 'Missing Parameter',
            EC: 1,
            DT: '',
        };
    }
    try {
        const user = await db.User.findOne({
            where: { email: data.email, type: 'LOCAL' },
        });

        if (user) {
            if (data.otp !== user.code) {
                return {
                    EM: 'OTP InValid',
                    EC: 1,
                    DT: '',
                };
            }
            let hashPassword = hashUserPassword(data.password);
            user.update({ password: hashPassword, code: null });
            return {
                EM: 'Reset Password Success',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: '',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something went wrong in the service',
            EC: -2,
            DT: [],
        };
    }
};

module.exports = {
    handleUserLogin,
    handleUserRegister,
    handleRefreshToken,
    upsertUserSocialMedia,
    checkTokenLogin,
    updateUserCode,
    checkUserWithEmail,
    resetPassword,
};
