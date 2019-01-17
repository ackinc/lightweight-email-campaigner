module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.import('./campaign');
  const Lead = sequelize.import('./lead');

  return sequelize.define(
    'campaignlead',
    {
      campaignId: {
        type: DataTypes.INTEGER,
        references: {
          model: Campaign,
          key: 'id',
        },
      },
      leadId: {
        type: DataTypes.INTEGER,
        references: {
          model: Lead,
          key: 'id',
        },
      },
      tracker: DataTypes.STRING,
      deliveredAt: DataTypes.DATE,
      openedAt: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );
};
