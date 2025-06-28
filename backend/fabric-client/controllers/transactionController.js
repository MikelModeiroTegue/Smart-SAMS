const connectToGateway = require("../gateway/fabricGateway");

exports.clockIn = async (req, res) => {
    const { studentName, matricule, email, courseSessionID } = req.body;

    // Basic input validation
    if (!studentName || !matricule || !courseSessionID || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        //Connect to Fabric Gateway with student identity
        const { gateway, contract } = await connectToGateway(email);

        //Submit transaction
        const resultBuffer = await contract.submitTransaction(
            "clockIn",
            courseSessionID,
            matricule,
            studentName
        );

        const resultJson = resultBuffer.toString();
        console.log("Clock-in result from chaincode:", resultJson);

        //Parse and validate response
        const response = JSON.parse(resultJson);

        if (!response.txId) {
            throw new Error("Blockchain transaction failed or no TxID returned");
        }

        //Clean disconnect
        await gateway.disconnect();

        //Send structured response
        res.status(200).json({
            message: "Clock-in recorded successfully",
            transactionId: response.txId,
            data: response,
        });
    } catch (err) {
        console.error("Error during clock-in:", err);
        res.status(500).json({ error: err.message || "Unknown blockchain error" });
    }
};
