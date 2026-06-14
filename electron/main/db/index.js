const path = require("path");
const { Sequelize } = require("sequelize");
const { app } = require("electron");

const isDev = !app.isPackaged;

const dbPath = isDev
    ? path.join(__dirname, "EOS.db")
    : path.join(app.getPath("userData"), "EOS.db");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false
});

module.exports = sequelize;