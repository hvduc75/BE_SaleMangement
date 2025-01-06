import db from "../models";

const getGroupWithRoles = async (user) => {
  let roles = await db.Group.findOne({
    where: { id: user.groupId },
    attributes: ["name"],
    include: {
      model: db.Role,
      attributes: ["url"],
      through: { attributes: [] },
    },
  });
  return roles ? roles : {};
};

module.exports = {
  getGroupWithRoles,
};
