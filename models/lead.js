module.exports = (sequelize, DataTypes) => sequelize.define('lead',
  {
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    timestamps: true,
  },
);
