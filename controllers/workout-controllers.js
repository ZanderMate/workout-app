// var express = require("express");
var path = require("path");
// var router = express.Router();
// Import the models to use its database functions.
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/exercise", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/exercise.html"));
    });

    app.get("/stats", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/stats.html"));
    });

    // app.post("/api/workouts", function(req, res) {
    //     db.Workout.create({

    //     })
    // })

    app.get("/api/workouts", function (req, res) {
        db.Workout.find()
            .then(result => {
                res.json(result);
                console.log(result);
            })
    })

    // app.put
}