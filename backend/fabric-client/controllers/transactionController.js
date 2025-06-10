const connectToGateway = require('../gateway/fabricGateway');

exports.clockIn = async (req, res) => {
    const { userId, fullName, timestamp, courseCode } = req.body;

    try {
        const { gateway, contract } = await connectToGateway(userId);

        const result = await contract.submitTransaction('ClockIn', userId, fullName, timestamp, courseCode);
        await gateway.disconnect();

        res.status(200).json({ message: 'Clock-in recorded', result: result.toString() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
