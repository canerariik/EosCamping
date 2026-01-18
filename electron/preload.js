const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
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
    usersRegister: (data) => ipcRenderer.invoke("users:register", data),

    // Settings
    settingsGet: () => ipcRenderer.invoke("settings:get"),
    settingsAdd: (data) => ipcRenderer.invoke("settings:add", data),
    settingsUpdate: (id, data) => ipcRenderer.invoke("settings:update", id, data),
    settingsDelete: (id) => ipcRenderer.invoke("settings:delete", id),
});



