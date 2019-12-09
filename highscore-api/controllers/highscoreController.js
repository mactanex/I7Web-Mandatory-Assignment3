"use strict"; //good practice
const accountSchema = require("./../models/accountSchema");

module.exports.updateHighscore = (req, res, next) => {
    const usersNewHighscore = req.query.highscore;
    const usersCurrentHighscore = req.user.highscore;
    if (usersNewHighscore > usersCurrentHighscore) {
        req.user.highscore = usersNewHighscore;
        req.user.save(function (err) {
            if (err) {
                res.status(400);
                res.json({
                    message: "error: " + err
                });
            } else {
                let highscores = [];
                accountSchema.User.find({}, (err, users) => {
                    if (err || !users.length) {
                        res.status(400);
                        res.json({
                            message: `Error: ${err} - are you sure any users exist?`
                        });
                    } else {
                        users.forEach((user) => {
                            users[user._id] = user;
                        });
                        users.forEach((user) => {
                            highscores.push(user.highscore);
                        });
                        const topFive = highscores.sort((a, b) => b - a).slice(0, highscores.length < 5 ? highscores.length : 5);
                        process.WebSocket.clients.forEach(c => c.send(JSON.stringify(topFive)));
                        res.status(200);
                        res.json({
                            topFive: topFive
                        });
                    }
                });
            }
        });
    } else {
        let highscores = [];
        accountSchema.User.find({}, (err, users) => {
            if (err || !users.length) {
                res.status(400);
                res.json({
                    message: `Error: ${err} - are you sure any users exist?`
                });
            } else {
                users.forEach((user) => {
                    users[user._id] = user;
                });
                users.forEach((user) => {
                    highscores.push(user.highscore);
                });
                const topFive = highscores.sort((a, b) => b - a).slice(0, highscores.length < 5 ? highscores.length : 5);
                process.WebSocket.clients.forEach(c => c.send(JSON.stringify(topFive)));
                res.status(200);
                res.json({
                    topFive: topFive
                });
            }
        });

    }
}