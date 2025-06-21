const { caClient, getWallet, caAdminId } = require("../utils/caUtils");

async function identityExists(userId) {
    const wallet = await getWallet();
    const adminIdentity = await wallet.get(caAdminId);
    if (!adminIdentity) {
        throw new Error("Admin identity not found in wallet. Enroll admin first.");
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, caAdminId);

    try {
        const identityService = caClient.newIdentityService();
        const identity = await identityService.getOne(userId, adminUser);
        return identity.result; // returns identity object if exists
    } catch (error) {
        if (error.message.includes("Identity was not found")) {
        return null; // identity doesn't exist
        }
        throw error; // other errors
    }
    }

    module.exports = { identityExists };
