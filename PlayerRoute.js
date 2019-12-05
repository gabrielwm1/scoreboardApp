const express = require("express");
const router = express.Router();
const pool = require("../connection");

function getPlayers(req, res) {
    pool.query("SELECT * FROM scoreboard_app").then(result => {
        res.json(result.rows);
    });
}

router.get("/", (req, res) => {
    pool.query("SELECT * FROM scoreboard_app").then(result => {
        res.json(result.rows);
    });
});
//post task
router.post("/", (req, res) => {
    const { id, name, score } = req.body;
    console.log(req.body);
    pool.query(
        `insert into scoreboard_app (id, name, score) values ($1, $2, $3)`,
        [id, name, score]
    )
        .then(() => {
            getPlayers(req, res);
        })
        .catch(err => res.status(400).send(err));
});

//update task
//increment score
router.put("/:id/increment", (req, res, next) => {
    pool.query(
        "update scoreboard_app set score = score + 1 where id=" + req.params.id
    )
        .then(() => {
            getPlayers(req, res);
        })
        .catch(err => res.status(400).send(err));
});
//decrement score
router.put("/:id/decrement", (req, res, next) => {
    pool.query(
        "update scoreboard_app set score = score - 1 where id=" + req.params.id
    )
        .then(() => {
            getPlayers(req, res);
        })
        .catch(err => res.status(400).send(err));
});
//delete player
router.delete("/:id", (req, res, next) => {
    pool.query("delete from scoreboard_app where id=" + req.params.id)
        .then(() => {
            getPlayers(req, res);
        })
        .catch(err => res.status(400).send(err));
});
// app.get("/players", (req, res) => res.send(players));

module.exports = router;
