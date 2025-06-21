const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const ccpPath = path.resolve(__dirname, "../config/connection.json"); // adjust if needed
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

const caInfo = ccp.certificateAuthorities["ca.org1.example.com"]; // adjust to match your CA name
const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
    );

    async function getWallet() {
    const walletPath = path.join(__dirname, "..", "wallet");
    return await Wallets.newFileSystemWallet(walletPath);
    }

    module.exports = {
    caClient,
    getWallet,
    caAdminId: "admin", // update if your CA admin username is different
    caMspId: "Org1MSP", // your MSP
    };
