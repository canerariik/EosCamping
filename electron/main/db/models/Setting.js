// main/db/models/Setting.js
const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");

const Setting = sequelize.define(
  "Setting",
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    ozellik: DataTypes.STRING,
    deger: DataTypes.STRING,
    defaultVeriMi: DataTypes.BOOLEAN,
    kayitDurumu: DataTypes.BOOLEAN,
  },
  {
    timestamps: false,
  }
);

Setting.afterSync(async () => {
  const defaults = [
    {
      ozellik: "yetiskin_ucret",
      deger: "1000",
      defaultVeriMi: true,
      kayitDurumu: true,
    },
    {
      ozellik: "cocuk_ucret",
      deger: "650",
      defaultVeriMi: true,
      kayitDurumu: true,
    },
    {
      ozellik: "bolge",
      deger: "A1,A2,A3,A4,A5,A6,A7",
      defaultVeriMi: true,
      kayitDurumu: true,
    },
  ];

  for (const item of defaults) {
    await Setting.findOrCreate({
      where: { ozellik: item.ozellik },
      defaults: item,
    });
  }
});

module.exports = Setting;
