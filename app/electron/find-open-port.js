"use strict";

const net = require("net");

function findPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.on("close", resolve.bind(null, port));
      server.close();
    });
  });
}

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port);
    socket.setTimeout(400, () => {
      socket.destroy();
      const error = new Error("ETIMEDOUT");
      error.code = "ETIMEDOUT";
      reject(error);
    });
    socket.on("error", error => {
      if (error.code === "ECONNREFUSED") {
        return resolve(true);
      }
      return reject(error);
    });
    socket.on("connect", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

module.exports = findPort;
findPort.findPort = findPort;
findPort.default = findPort;
findPort.isPortAvailable = isPortAvailable;
