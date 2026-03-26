const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 820,
    height: 1180,
    resizable: true,
    title: '旅游番茄钟 - 430x932',
    webPreferences: {
      deviceScaleFactor: 3
    }
  })
  win.loadURL('http://localhost:3000')
})

app.on('window-all-closed', () => app.quit())
