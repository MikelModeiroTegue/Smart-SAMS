const express = require("express");
const router = express.Router();
const { identityExists } = require("../controllers/identityVerification");

router.get("/api/identities/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const identity = await identityExists(userId);
        if (identity) {
        res.status(200).json({ success: true, identity });
        } else {
        res.status(404).json({ success: false, message: "Identity not found" });
        }
    } catch (error) {
        console.error("Error checking identity:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
    });

module.exports = router;
