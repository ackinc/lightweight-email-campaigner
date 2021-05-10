module.exports = (sequelize, DataTypes) => sequelize.define(
  'user',
  {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    refreshToken: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('user', 'authorized_user'),
      defaultValue: 'user',
    },
  },
  {
    timestamps: true,
  },
);
