// Kullanıcı yönetimi için IPC
const User = require("../main/db/models/User");

module.exports = (ipcMain) => {
    debugger
    ipcMain.handle("users:get", async () => {
        const users = await User.findAll({ where: { kayitDurumu: true } });
        return users.map(u => u.get({ plain: true }));
    });

    ipcMain.handle("users:add", async (event, data) => {
        const existing = await User.findOne({ where: { kullaniciAdi: data.kullaniciAdi } });
        if (existing) return { error: "Bu kullanıcı adı zaten var" };
        const result = await User.create({ ...data, kayitDurumu: true });
        return result.get({ plain: true });
    });

    ipcMain.handle("users:update", async (event, id, newData) => {
        await User.update(newData, { where: { id } });
        return true;
    });

    ipcMain.handle("users:delete", async (event, id) => {
        const user = await User.findByPk(id);
        user.kayitDurumu = false;
        await User.update(user, { where: { id } });
        return true;
    });

    ipcMain.handle("users:register", async (event, data) => {
        debugger
        const existing = await User.findOne({ where: { kullaniciAdi: data.kullaniciAdi } });
        if (existing) return { error: "Bu kullanıcı adı zaten var" };
        const newUser = await User.create({ ...data, kayitDurumu: true });
        return newUser.get({ plain: true });
    });
};
