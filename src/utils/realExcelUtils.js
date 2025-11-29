// src/utils/realExcelUtils.js → SADECE ELECTRON'DA ÇALIŞIR
import * as XLSX from 'xlsx';

let cachedData = null;
const isElectron = !!window.require;

export const realExcelUtils = {
    async load() {
        if (!isElectron) return { reservations: [] };
        if (cachedData) return cachedData;

        return new Promise((resolve) => {
            window.ipcRenderer.invoke('read-excel').then(data => {
                cachedData = data;
                resolve(data);
            });
        });
    },

    async save(data) {
        if (!isElectron) return;
        cachedData = data;
        await window.ipcRenderer.invoke('write-excel', data);
    }
};