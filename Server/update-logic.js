const io = require("socket.io");

function init(listener) {

    const socketManager = io(listener, { cors: { origin: "*" } });

    socketManager.sockets.on("connection", socket => {
        console.log("A client is connected");
        console.log(`${socketManager.engine.clientsCount} online connections`);

        socket.on("disconnect", () => {
            console.log("A client is disconnected");
            console.log(`${socketManager.engine.clientsCount} online connections`);
        });

        socket.on("info-update", vacationId => { // admin changed vacation
            socketManager.sockets.emit("new-info", vacationId);
        });
    });
}

module.exports = {
    init
}