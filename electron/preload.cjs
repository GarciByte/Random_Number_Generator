const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  // Generación de números
  generateNumbers: settings => ipcRenderer.invoke('generate-numbers', settings),

  // Historial
  getHistory:      ()       => ipcRenderer.invoke('get-history'),
  clearHistory:    ()       => ipcRenderer.invoke('clear-history'),

  // Configuración
  getConfig:       ()       => ipcRenderer.invoke('get-config'),
  saveConfig:      cfg      => ipcRenderer.invoke('save-config', cfg),
  
  // Actualizaciones
  getAppVersion:    ()     => ipcRenderer.invoke('get-app-version'),
  checkForUpdates:  ()     => ipcRenderer.invoke('check-updates'),
  openExternal: url        => ipcRenderer.invoke('open-external', url),
});
