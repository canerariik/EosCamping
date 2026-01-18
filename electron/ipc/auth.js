const User = require("../main/db/models/User");

module.exports = (ipcMain) => {
    ipcMain.handle("authLogin", async (event, { username, password }) => {
        const user = await User.findOne({
            where: {
                kullaniciAdi: username,
                sifre: password,
                kayitDurumu: 1
            }
        });

        if (user) {
            return {
                id: user.id,
                isim: user.isim,
                soyisim: user.soyisim,
                role: user.role,
                kayitDurumu: user.kayitDurumu
            };
        }

        return null;
    });

};
