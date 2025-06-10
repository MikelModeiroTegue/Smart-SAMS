const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '../config/connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

exports.enrollUser = async (req, res) => {
    const { userId, affiliation } = req.body;

    try {
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);
        const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, '../wallet'));

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) return res.status(401).send('Admin identity not found.');

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const secret = await ca.register({ enrollmentID: userId, role: 'client', affiliation }, adminUser);
        const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: process.env.ORG_MSP,
            type: 'X.509',
        };

        await wallet.put(userId, x509Identity);
        res.status(200).send('Enrollment successful.');
    } catch (err) {
        console.error(err);
        res.status(500).send(`Enrollment failed: ${err.message}`);
    }
};
