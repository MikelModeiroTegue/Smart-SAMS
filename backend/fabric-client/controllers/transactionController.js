const connectToGateway = require('../gateway/fabricGateway');

exports.clockIn = async (req, res) => {
    const { studentName, matricule, email, courseSessionID } = req.body;

    // Basic input validation
    if (!studentName || !matricule || !courseSessionID || !email ) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const { gateway, contract } = await connectToGateway(email);

        // Invoke clockIn with updated params
        const result = await contract.submitTransaction(
            'clockIn',
            Name = studentName,
            sessionID = courseSessionID,
            studentID = matricule,
        );

        await gateway.disconnect();

        res.status(200).json({ message: 'Clock-in recorded', result: result.toString() });
    } catch (err) {
        console.error('Error during clock-in:', err);
        res.status(500).json({ error: err.message });
    }
};
