const createWindowsInstaller = require("electron-installer-windows");

async function createInstaller() {
    try {
        await createWindowsInstaller({
            src: "./dist/BillingApp-win32-x64/", // Make sure this path is correct
            dest: "./installer/",
            authors: ["Your Name"], // Change this to an array (["Your Name"])
            exe: "BillingApp.exe",
            description: "Offline Billing Application",
        });
        console.log("✅ Installer Created Successfully!");
    } catch (error) {
        console.error(`❌ Error creating installer: ${error.message}`);
    }
}

createInstaller();
