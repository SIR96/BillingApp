const { app, BrowserWindow, autoUpdater, dialog } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "public", "index.html"));

    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
});

// Auto-update event listeners
autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Update Available",
        message: "A new update is available. It will be downloaded in the background."
    });
});

autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Update Ready",
        message: "Restart the app to apply the update.",
    }).then(() => {
        autoUpdater.quitAndInstall();
    });
});
