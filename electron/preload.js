const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("electronAPI", {

    activateLicense: (password) => ipcRenderer.invoke("license:activate", password),

    // Auth
    authLogin: (data) => ipcRenderer.invoke("authLogin", data),

    // Reservations
    reservationsGet: () => ipcRenderer.invoke("reservations:get"),
    reservationsAdd: (data) => ipcRenderer.invoke("reservations:add", data),
    reservationsUpdate: (id, data, userId) => ipcRenderer.invoke("reservations:update", id, data, userId),
    reservationsDelete: (id, userId) => ipcRenderer.invoke("reservations:delete", id, userId),

    // Users
    usersList: () => ipcRenderer.invoke("users:get"),
    usersCreate: (data) => ipcRenderer.invoke("users:add", data),
    usersUpdate: (id, data) => ipcRenderer.invoke("users:update", id, data),
    usersDelete: (id) => ipcRenderer.invoke("users:delete", id),

    // Settings
    settingsGet: () => ipcRenderer.invoke("settings:get"),
    settingsAdd: (data) => ipcRenderer.invoke("settings:add", data),
    settingsUpdate: (id, data) => ipcRenderer.invoke("settings:update", id, data),
    settingsDelete: (id) => ipcRenderer.invoke("settings:delete", id),

    // Personel
    personelsList: () => ipcRenderer.invoke("personels:get"),
    personelsCreate: (data) => ipcRenderer.invoke("personels:add", data),
    personelsUpdate: (id, data) => ipcRenderer.invoke("personels:update", id, data),
    personelsDelete: (id) => ipcRenderer.invoke("personels:delete", id),
});



