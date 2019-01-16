module.exports = (sequelize, DataTypes) => {
  const User = sequelize.import('./user');

  return sequelize.define('campaign',
    {
      name: DataTypes.STRING,
      subject: DataTypes.STRING,
      body: DataTypes.TEXT,
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
    },
  );
};
