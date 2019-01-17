module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.import('./campaign');
  const Lead = sequelize.import('./lead');

  return sequelize.define(
    'campaignlead',
    {
      campaign_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Campaign,
          key: 'id',
        },
      },
      lead_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Lead,
          key: 'id',
        },
      },
      delivered: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      tracker: DataTypes.STRING,
      openAt: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );
};
