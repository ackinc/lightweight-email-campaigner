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
      delivered: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      sendgridMailId: DataTypes.STRING,
      openAt: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );
};
