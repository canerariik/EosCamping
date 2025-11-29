const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    readExcel: () => ipcRenderer.invoke('read-excel'),
    writeExcel: (data) => ipcRenderer.invoke('write-excel', data)
});
