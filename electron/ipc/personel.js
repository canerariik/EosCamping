// main/ipc/personelIPC.js
const Personel = require("../main/db/models/Personel");
const { Op } = require("sequelize");
const sequelize = require("../main/db/index");

module.exports = (ipcMain) => {

    ipcMain.handle("personels:get", async () => {
        const personels = await Personel.findAll({ where: { kayitDurumu: true } });
        return personels.map(u => u.get({ plain: true }));
    });

    ipcMain.handle("personels:add", async (event, data) => {
        const personel = await Personel.findOne({
            where: { tcNo: data.tcNo, kayitDurumu: true }
        });
        
        if (personel)
            throw new Error("Bu personel zaten var.");

        const created = await Personel.create({
            ...data,
            kayitDurumu: true
        });

        return created.get({ plain: true });
    });

    ipcMain.handle("personels:update", async (event, id, newData) => {
        const personel = await Personel.findByPk(id);

        if (!personel)
            throw new Error("Personel bulunamadı.");

        const existing = await Personel.findOne({
            where: {
            kayitDurumu: true,
            id: { [Op.ne]: personel.id },
            [Op.and]: sequelize.where(
                sequelize.fn('lower', sequelize.col('tcNo')),
                newData.tcNo.toLowerCase()
            )
            }
        });
        
        if (existing) {
            return { 
                error: "Aynı personel zaten mevcut.",
                existing: existing
            };
        }

        await personel.update(newData);

        return { success: true };
    });

    ipcMain.handle("personels:delete", async (event, id) => {
      const personel = await Personel.findByPk(id);
      
      if (!personel)
        throw new Error("Personel bulunamadı.");

      await personel.destroy();

      return { success: true };
    });
};
