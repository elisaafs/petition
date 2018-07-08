const express = require("express");
const app = express();
const db = require("./db/db.js");
const bodyParser = require("body-parser");
const hb = require("express-handlebars");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bc = require("./conf/bcrypt.js");

app.use(
    cookieSession({
        secret: `I'm always hungry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", hb());

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("home", {
        layout: "main"
    });
});

app.post("/", (req, res) => {
    let pass = "";
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.emailAddress == "" ||
        req.body.password == ""
    ) {
        res.render("home", {
            layout: "main",
            error: "Please fill all the fields bellow."
        });
    } else {
        bc.hashPassword(req.body.password)
            .then(hashedPassword => {
                pass = hashedPassword;
                db.registerUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    pass
                ).then(registeredUser => {
                    req.session.signatureId = registeredUser.id;
                    console.log("registeredUser.id", registeredUser.id);
                    res.json(registeredUser);
                    res.redirect("/sign");
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.use((req, res, next) => {
    if (!req.session.signatureId) {
        res.redirect("/");
    } else {
        next();
    }
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", (req, res) => {
    if (req.body.emailAddress == "" || req.body.password == "") {
        res.render("login", {
            layout: "main",
            error: "Please fill all the fields bellow."
        });
    } else {
        db.getInfo(req.body.email).then(results => {
            if (results.length == 0) {
                res.redirect("/login");
            } else {
                let hashedPassword = results.hashed_password;
                bc.checkPassword(req.body.password, hashedPassword).then(
                    checked => {
                        if (checked) {
                            res.redirect("/sign");
                            console.log(checked);
                        } else {
                            res.redirect("/login");
                            res.render("login", {
                                layout: "main",
                                error: "Email or password incorrect."
                            });
                        }
                    }
                );
            }
        });
    }
});

app.get("/sign", (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

app.post("/sign", (req, res) => {
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.signatureName == ""
    ) {
        res.render("sign", {
            layout: "main",
            error: "Please fill all the fields bellow and sign."
        });
    } else {
        db.insertUser(
            req.body.firstname,
            req.body.lastname,
            req.body.signatureName
        ).then(newUser => {
            req.session.signatureId = newUser.id;
            req.session.user = {
                keyId: newUser.id,
                keyFirstName: newUser.first_name,
                keyLastName: newUser.last_name
            };
            res.redirect("/thanks");
        });
    }
});

app.get("/thanks", (req, res) => {
    db.getId(req.session.signatureId).then(results => {
        res.render("thankspage", {
            layout: "main2",
            nOfSigners: results.length,
            firstname: results.first_name,
            lastname: results.last_name,
            signature: results.signature
        });
    });
});

app.get("/signers", (req, res) => {
    db.getSigners().then(results => {
        res.render("signers", {
            layout: "main2",
            content: results
        });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.listen(8080);
