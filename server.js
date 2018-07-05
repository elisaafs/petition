const express = require("express");
const app = express();
const db = require("./db/db.js");
const bodyParser = require("body-parser");
const hb = require("express-handlebars");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

app.use(
    cookieSession({
        secret: `I'm hungry!!!`,
        maxAge: 1000 * 60 * 60 * 24 * 21
    })
);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.engine("handlebars", hb({}));

app.set("view engine", "handlebars");

function checkForSig(req, res, next) {
    console.log("checkForSig", req.session.signatureId);
    !req.session.signatureId ? res.redirect("/") : next();
}

app.get("/", (req, res) => {
    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }
    res.render("home", {
        layout: "main"
    });
});

app.post("/", (req, res) => {
    db.insertUser(
        req.body.firstname,
        req.body.lastname,
        req.body.signatureName
    ).then(newUser => {
        req.session.signatureId = newUser.id;
        res.redirect("/thanks");
    });
});

app.get("/thanks", checkForSig, (req, res) => {
    db.getSigners().then(results => {
        res.render("thankspage", {
            layout: "main",
            nOfSigners: results
        });
    });
});

app.get("/signers", (req, res) => {
    db.getName().then(results => {
        res.render("signers", {
            layout: "main",
            content: results
        });
    });
});

app.listen(8080);
