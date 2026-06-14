// main/db/models/Setting.js
const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");

const Setting = sequelize.define(
  "Setting",
  {
    id: {type: DataTypes.UUID,defaultValue: UUIDV4,primaryKey: true},
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
  const varsayilanlar = [
    {
      ozellik: "yetiskin_Ucret",
      deger: "2000",
    },
    {
      ozellik: "cocuk_Ucret",
      deger: "1000",
    },
    {
      ozellik: "cadir_Sayisi",
      deger: "150",
    },
    {
      ozellik: "gunu_Birlik_Yetiskin",
      deger: "600",
    },
    {
      ozellik: "gunu_Birlik_Cocuk",
      deger: "400",
    },
  ];

  for (const item of varsayilanlar) {
    await Setting.findOrCreate({
      where: {
        ozellik: item.ozellik,
      },
      defaults: {
        ...item,
        defaultVeriMi: true,
        kayitDurumu: true,
      },
    });
  }
});

module.exports = Setting;