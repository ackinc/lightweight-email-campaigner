module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "user",
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
      accessToken: DataTypes.STRING,
      accessTokenScope: DataTypes.STRING,
      accessTokenExpiresAt: DataTypes.BIGINT,
      refreshToken: DataTypes.STRING,
    },
    {
      timestamps: true,
    }
  );
