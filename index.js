const { app, BrowserWindow, session, shell } = require('electron');
const path = require('path');
async function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Set the cookie before loading the page
  session.defaultSession.cookies.set({
    url: 'https://remoteaccess.anywhere.cargill.com', // The URL for which the cookie should be valid
    name: 'CtxsDesktopAutoLaunchDone',
    value: 'yes',
    path: '/', // The path scope of the cookie
    secure: true, // Set to true if this is an HTTPS site
    httpOnly: false, // Set to true if the cookie should be accessible by JavaScript
  }).then(() => {
    win.loadURL('https://remoteaccess.anywhere.cargill.com/Citrix/ExternalAccessWeb/');
    autoStartDownloadedFile(win);
  }).catch(error => {
    console.error("Failed to set cookie:", error);
    win.loadURL('https://remoteaccess.anywhere.cargill.com/Citrix/ExternalAccessWeb/');
    autoStartDownloadedFile();
  });
}

function autoStartDownloadedFile(win) {
  win.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the path for saving the downloaded file
    const filePath = path.join(app.getPath('downloads'), item.getFilename());
    item.setSavePath(filePath);

    // Track the download process
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
      } else if (state === 'progressing') {
        if (item.isPaused()) {
        } else {
        }
      }
    });

    // When the download is complete, open the file
    item.once('done', (event, state) => {
      if (state === 'completed') {
        shell.openPath(filePath).then(() => {}).catch(err => {});
      } else {
      }
    });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
