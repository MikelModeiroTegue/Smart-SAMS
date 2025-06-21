// fabricListener.js

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const courseSessionRepo = require("../../system-data/repository/courseSessionRepository");
require("dotenv").config();

const channelName = "mychannel";
const chaincodeName = "attendance";

let currentSessions = []; // List of ongoing sessions to track per day

async function getTodaySessions() {
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const sessions = await courseSessionRepo.getCourseSchedules_byDay(
        day
    );
    return sessions.filter((session) => session.ongoing); // Implement a function to filter the ongoing sessions
}

async function listenForBlockEvents() {
    const ccpPath = path.resolve(
        __dirname,
        "../config/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const walletPath = path.join(__dirname, "../wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("admin");
    if (!identity) throw new Error("Admin identity not found in wallet");

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: "admin",
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const listener = async (event) => {
        const block = event.blockData;

        const txs = block.data.data;
        for (const tx of txs) {
            const txID = tx.payload.header.channel_header.tx_id;
            const payload = JSON.parse(
                tx.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[1].toString()
            );
            const { sessionID, matricule, name } = payload;

            const matchingSession = currentSessions.find((s) => s.ID === sessionID);
            if (matchingSession) {
                const meta = await courseSessionRepo.getCourseDetailsBySessionID(
                    sessionID
                );

                const attendancePayload = {
                    sessionID,
                    matricule,
                    name,
                    ...meta,
                    timestamp: new Date().toISOString(),
                    txID,
                };

                broadcast(attendancePayload);
            }
        }
    };

    await network.addBlockListener(listener);
    console.log("Listening to block events...");
}

// WebSocket Server for real-time streaming
const wss = new WebSocket.Server({ port: 4000 });
function broadcast(data) {
    const json = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

(async () => {
    currentSessions = await getTodaySessions();
    await listenForBlockEvents();
})();

// start the listener with server and install: npm install fabric-network ws dotenv
// and run: node fabricListener.js
