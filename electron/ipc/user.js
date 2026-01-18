// main/ipc/userIPC.js
const User = require("../main/db/models/User");
const { Op } = require("sequelize");
const sequelize = require("../main/db/index");

module.exports = (ipcMain) => {

    // TÜM AKTİF KULLANICILAR
    ipcMain.handle("users:get", async () => {
        const users = await User.findAll({ where: { kayitDurumu: true } });
        return users.map(u => u.get({ plain: true }));
    });

    // EKLE (INSERT)
    ipcMain.handle("users:add", async (event, data) => {
        const user = await User.findOne({
            where: { kullaniciAdi: data.kullaniciAdi, kayitDurumu: true }
        });
        
        if (user)
            throw new Error("Bu kullanıcı adı zaten var.");

        const created = await User.create({
            ...data,
            kayitDurumu: true
        });

        return created.get({ plain: true });
    });

    // GÜNCELLE (UPDATE)
    ipcMain.handle("users:update", async (event, id, newData) => {
        const user = await User.findByPk(id);

        if (!user)
            throw new Error("Kullanıcı bulunamadı.");

        const existing = await User.findOne({
            where: {
            kayitDurumu: true,
            id: { [Op.ne]: user.id },
            [Op.and]: sequelize.where(
                sequelize.fn('lower', sequelize.col('kullaniciAdi')),
                newData.kullaniciAdi.toLowerCase()
            )
            }
        });
        
        if (existing) {
            return { 
                error: "Bu kullanıcı adı zaten kullanılıyor.",
                existing: existing // buraya ekledim
            };
        }

        await user.update(newData);

        return { success: true };
    });

    // SİL
    ipcMain.handle("users:delete", async (event, id) => {
      const user = await User.findByPk(id);
      
      if (!user)
        throw new Error("Kullanıcı bulunamadı.");

      await user.destroy();

      return { success: true };
    });
};
