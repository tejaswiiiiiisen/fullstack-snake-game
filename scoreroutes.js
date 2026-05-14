const express = require("express");

const router = express.Router();

const Score = require("../models/Score");

router.post("/save-score", async (req, res) => {

    try {

        const { name, score } = req.body;

        const newScore = new Score({
            name,
            score
        });

        await newScore.save();

        res.json({
            message: "Score Saved Successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

router.get("/leaderboard", async (req, res) => {

    try {

        const scores = await Score.find()
        .sort({ score: -1 });

        res.json(scores);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;