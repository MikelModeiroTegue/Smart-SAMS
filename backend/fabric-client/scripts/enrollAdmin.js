const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
    try {
        // Load the network configuration
        const ccpPath = path.resolve(__dirname, '../config/connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        // Create a wallet to manage identities
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check if admin is already enrolled
        const adminIdentity = await wallet.get('admin');
        if (adminIdentity) {
            console.log('Admin identity already exists in the wallet');
            return;
        }

        // Enroll the admin user
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: process.env.ORG_MSP || 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('Admin identity enrolled and stored in the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
        process.exit(1);
    }
}

main();
