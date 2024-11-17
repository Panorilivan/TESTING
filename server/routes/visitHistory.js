const express = require("express");
const router = express.Router();
const LoginHistory = require("../models/loginHistory");

// Retrieve Visit History (All or by User)
router.get("/:userId?", async (req, res) => {
  try {
    const { userId } = req.params;

    // If a userId is provided, fetch history for that user; otherwise, fetch all
    const query = userId ? { userId } : {};
    const loginHistoryData = await LoginHistory.find(query)
      .populate("userId", "firstName lastName email") // Populate user details
      .sort({ date: -1 });

    if (!loginHistoryData.length) {
      return res.status(404).json({ message: "No visit history found." });
    }

    res.status(200).json({ loginHistory: loginHistoryData });
  } catch (error) {
    console.error("Error retrieving visit history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
