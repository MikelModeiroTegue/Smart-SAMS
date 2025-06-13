const connectToGateway = require('../gateway/fabricGateway');

exports.clockIn = async (req, res) => {
    const { userId, name, courseCode, timestamp, sessionId } = req.body;

    // Basic input validation
    if (!userId || !name || !courseCode || !timestamp || !sessionId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const { gateway, contract } = await connectToGateway(userId);

        // Invoke clockIn with updated params
        const result = await contract.submitTransaction(
            'clockIn',
            userId,
            name,
            courseCode,
            timestamp,
            sessionId
        );

        await gateway.disconnect();

        res.status(200).json({ message: 'Clock-in recorded', result: result.toString() });
    } catch (err) {
        console.error('Error during clock-in:', err);
        res.status(500).json({ error: err.message });
    }
};
