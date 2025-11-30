const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");
const User = require("./User");

const Reservation = sequelize.define("Rezervasyon", {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    kod: DataTypes.STRING,
    isim: DataTypes.STRING,
    soyisim: DataTypes.STRING,
    telefon: DataTypes.STRING,
    tcNo: DataTypes.STRING,
    plaka: DataTypes.STRING,
    yetiskinSayisi: DataTypes.INTEGER,
    cocukSayisi: DataTypes.INTEGER,
    cadirSayisi: DataTypes.INTEGER,
    girisTarihi: DataTypes.DATEONLY,
    cikisTarihi: DataTypes.DATEONLY,
    gunSayisi: DataTypes.INTEGER,
    kampBolge: DataTypes.STRING,
    kapora: DataTypes.FLOAT,
    nakitUcret: DataTypes.FLOAT,
    kartUcret: DataTypes.FLOAT,
    odenenNakit: DataTypes.FLOAT,
    odenenKart: DataTypes.FLOAT,
    odenenHavale: DataTypes.FLOAT,
    kalanNakitUcret: DataTypes.FLOAT,
    kalanKartUcret: DataTypes.FLOAT,
    aciklama: DataTypes.STRING,
    kayitDurumu: DataTypes.BOOLEAN
});

Reservation.belongsTo(User, { as: "user" });

module.exports = Reservation;
