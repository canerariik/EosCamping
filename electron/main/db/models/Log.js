const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../index");
const User = require("./User");
const Reservation = require("./Reservation");

const Log = sequelize.define("Logs", {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    islem: DataTypes.STRING,
    eskiDeger: DataTypes.TEXT,
    yeniDeger: DataTypes.TEXT,
    olusturmaTarihi: DataTypes.DATE,
    guncellemeTarihi: DataTypes.DATE
}, {
    timestamps: false
});

Log.belongsTo(User, { as: "user" });
Log.belongsTo(Reservation, { as: "reservation" });

module.exports = Log;
