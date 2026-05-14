const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({

    name: {
        type: String
    },

    score: {
        type: Number
    }

});

module.exports = mongoose.model("Score", scoreSchema);