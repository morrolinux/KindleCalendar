const COLOR_OK = "#1f7f39";
const COLOR_ERROR = "#c43131";

const setMessage = function(message) {
    body.innerHTML = message;
};

const updateBG = function(className) {
	body.className = className;
};

var active = false;

const startListener = function() {
    if (active)
	return;
    active = true;
    wsConn = new WebSocket('ws://' + window.location.hostname + ":8080/");


    wsConn.onopen = function() {
		setMessage("Active", COLOR_OK);
    }
    wsConn.onclose = function(e) {
		setMessage("Disconn. " + JSON.stringify(e), COLOR_ERROR);
		active = false;
    }
    wsConn.onerror = function(e, code) {
		setMessage("ERROR " + code + e, COLOR_ERROR);
    }
    wsConn.onmessage = function(message) {
		try {
			var data = JSON.parse(message.data);
			setMessage(data.msj);

			if(data.sc === "bg") {
				updateBG(data.msj);
			}

		} catch(e) {
			setMessage("MSG ERROR", COLOR_ERROR);
		}
    }
}

startListener();
