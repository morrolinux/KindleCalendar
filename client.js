const body = document.body;

const COLOR_OK = '#1f7f39';
const COLOR_ERROR = '#c43131';
const fileNames = ['gcal.png', 'screenshot.png'];

let active = false;
let currentView = 0;

const setMessage = (message, color) => {
  body.innerHTML = message;
  if (color) {
    body.style.color = color;
  }
};

const setBG = (fileName) => {
  const now = new Date().getTime();
  body.style.backgroundImage = `url("http://${window.location.hostname}:8080/${fileName}?${now}")`;
};

const cycleCurrentView = () => {
  currentView = (currentView + 1) % fileNames.length;
  setBG(fileNames[currentView]);
};

const startListener = () => {
  if (active) {
    return;
  }

  active = true;
  const wsConn = new WebSocket(`ws://${window.location.hostname}:8080/`);

  wsConn.onopen = () => {
    setMessage('Active', COLOR_OK);
  };

  wsConn.onclose = (e) => {
    setMessage(`Disconn. ${JSON.stringify(e)}`, COLOR_ERROR);
    active = false;
  };

  wsConn.onerror = (e) => {
    setMessage(`ERROR ${e.code} ${e}`, COLOR_ERROR);
  };

  wsConn.onmessage = (message) => {
    try {
      const data = JSON.parse(message.data);
      setMessage(data.msj);

      if (data.sc === 'bg') {
        if (data.msj === 'gcal.png' && fileNames[currentView] !== data.msj) {
          return;
        }

        currentView = fileNames.indexOf(data.msj);
        setBG(fileNames[currentView]);
      }
    } catch (e) {
      setMessage(`MSG ERROR: ${e}`, COLOR_ERROR);
    }
  };
};

// TAP to change view
body.onclick = () => {
  cycleCurrentView();
};

startListener();
