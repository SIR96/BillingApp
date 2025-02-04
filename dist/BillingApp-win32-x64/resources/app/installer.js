const createWindowsInstaller = require("electron-installer-windows");

createWindowsInstaller({
    src: "./dist/BillingApp-win32-x64",
    dest: "./installer",
    authors: "Your Name",
    exe: "BillingApp.exe",
    description: "Offline Billing Application"
}).then(() => console.log("Installer Created!"));
