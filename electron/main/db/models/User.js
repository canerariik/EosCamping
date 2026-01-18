const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");

const User = sequelize.define("Kullanici", {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    isim: DataTypes.STRING,
    soyisim: DataTypes.STRING,
    role: DataTypes.STRING,
    kullaniciAdi: DataTypes.STRING,
    sifre: DataTypes.STRING,
    kayitDurumu: DataTypes.BOOLEAN
}, {
    timestamps: false 
});

module.exports = User;
