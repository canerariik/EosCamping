const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");

const Personel = sequelize.define("Personel", {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    isim: DataTypes.STRING,
    soyisim: DataTypes.STRING,
    tcNo: DataTypes.STRING,
    dogumTarihi: DataTypes.DATEONLY,
    adres: DataTypes.STRING,
    telNo: DataTypes.STRING,
    iseGirisTarihi: DataTypes.DATEONLY,
    aciklama: DataTypes.STRING,
    kayitDurumu: DataTypes.BOOLEAN,
    kayitTarihi: DataTypes.DATE,
}, {
    timestamps: false 
});

module.exports = Personel;
