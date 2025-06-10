const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../config/connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function connectToGateway(userId) {
    const walletPath = path.join(__dirname, '../wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
    const contract = network.getContract(process.env.CHAINCODE_NAME);

    return { gateway, contract };
}

module.exports = connectToGateway;
