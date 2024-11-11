import db from '../models';

const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({
            order: [['id', 'DESC']],
        });
        return {
            EM: 'Get all role succeeds',
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

const createNewRoles = async (roles) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true,
        });
        const persists = roles.filter(({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2));
        if (persists.length === 0) {
            return {
                EM: 'Nothing to create ...',
                EC: 0,
                DT: [],
            };
        } else {
            await db.Role.bulkCreate(roles);
            return {
                EM: `Create roles succeeds ${persists.length} roles...`,
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

const deleteRole = async (id) => {
    try {
        let role = await db.Role.findOne({ where: { id: id } });
        if (role) {
            await role.destroy();
        }
        return {
            EM: 'Delete Roles Succeeds',
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

const updateRole = async (data) => {
    try {
        let role = await db.Role.findOne({ where: { id: data.id } });
        if (role) {
            await role.update({
                url: data.url,
                description: data.description,
            });
            return {
                EM: 'Update Role succeeds',
                EC: 0,
                DT: '',
            };
        } else {
            return {
                EM: 'Role not found',
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

const getRoleByGroup = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'Not found any roles',
                EC: 0,
                DT: [],
            };
        }

        let roles = await db.Group.findOne({
            where: { id: id },
            attributes: ['id', 'name', 'description'],
            include: {
                model: db.Role,
                attributes: ['id', 'url', 'description'],
                through: { attributes: [] },
            },
        });

        return {
            EM: 'Get Roles by group Succeeds',
            EC: 0,
            DT: roles,
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

const assignRoleToGroup = async (data) => {
    try {
        await db.Group_Role.destroy({
            where: { groupId: +data.groupId },
        });
        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            EM: 'Assign Role to group Succeeds',
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

module.exports = {
    createNewRoles,
    getAllRoles,
    updateRole,
    deleteRole,
    getRoleByGroup,
    assignRoleToGroup,
};
