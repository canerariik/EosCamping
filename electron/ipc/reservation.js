const Reservation = require("../main/db/models/Reservation");
const Log = require("../main/db/models/Log");
const { generateKod } = require("../main");

module.exports = (ipcMain) => {

    ipcMain.handle("reservations:get", async () => {
        const reservations = await Reservation.findAll({ where: { kayitDurumu: true } });
        return reservations.map(r => r.get({ plain: true }));
    });

    ipcMain.handle("reservations:add", async (event, data) => {
        data.kod = generateKod();
        data.kayitDurumu = true;

        const result = await Reservation.create(data);
        await Log.create({
            islem: "ekleme",
            userId: data.userId,
            reservationId: result.id,
            eskiDeger: "-",
            yeniDeger: JSON.stringify(result.get({ plain: true })),
            olusturmaTarihi: new Date(),
            guncellemeTarihi: null
        });

        return result.get({ plain: true });
    });

    ipcMain.handle("reservations:update", async (event, id, newData, userId) => {
        const old = await Reservation.findByPk(id);
        await Log.create({
            islem: "guncelleme",
            userId,
            reservationId: id,
            eskiDeger: JSON.stringify(old.get({ plain: true })),
            yeniDeger: JSON.stringify(newData),
            olusturmaTarihi: null,
            guncellemeTarihi: new Date()
        });
        await Reservation.update(newData, { where: { id } });
        return true;
    });

    ipcMain.handle("reservations:delete", async (event, id, userId) => {
        const old = await Reservation.findByPk(id);
        old.kayitDurumu = false;
        await Reservation.update(old, { where: { id } });

        await Log.create({
            islem: "silme",
            userId,
            reservationId: id,
            eskiDeger: JSON.stringify(old.get({ plain: true })),
            yeniDeger: "-",
            olusturmaTarihi: null,
            guncellemeTarihi: new Date()
        });
        await old.destroy();
        return true;
    });
};
