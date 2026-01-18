// main/ipc/settings.js
const Setting = require("../main/db/models/Setting");

module.exports = (ipcMain) => {
  ipcMain.handle("settings:get", async () => {
    const settings = await Setting.findAll({ where: { kayitDurumu: true } });
    return settings.map((u) => u.get({ plain: true }));
  });

  ipcMain.handle("settings:add", async (event, data) => {
    const setting = await Setting.findOne({
      where: { ozellik: data.ozellik, kayitDurumu: true },
    });

    if (setting) throw new Error("Bu özellik zaten var.");

    const created = await Setting.create({
      ...data,
      defaultVeriMi: false,
      kayitDurumu: true,
    });

    return created.get({ plain: true });
  });

  ipcMain.handle("settings:update", async (event, id, data) => {
    const setting = await Setting.findByPk(id);

    if (!setting) throw new Error("Özellik bulunamadı.");

    await Setting.update(data, { where: { id } });
    return true;
  });

  ipcMain.handle("settings:delete", async (event, id) => {
    const setting = await Setting.findByPk(id);
    setting.kayitDurumu = false;
    await Setting.update(setting, { where: { id } });

    if (!setting) throw new Error("Özellik bulunamadı.");

    await setting.destroy();
    return { success: true };
  });
};
