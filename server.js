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
                    req.session.id = registeredUser.id;
                    console.log("registeredUser.id", registeredUser.id);
                    res.redirect("/profile");
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    if (isNaN(req.body.age)) {
        res.render("profile", {
            layout: "main",
            error: "Write just numbers in the field 'Age'."
        });
    } else {
        console.log("Where is the response? 1");
        db.insertInfoUsers(
            req.session.id,
            req.body.age,
            req.body.areaOfBerlin,
            req.body.homepage
        )
            .then(newUserInfos => {
                console.log("Where is the response? 2");
                req.session.infos = newUserInfos.id;
                req.session.user = {
                    keyAge: newUserInfos.age,
                    keyAreaOfBerlin: newUserInfos.areaOfBerlin,
                    keyHomepage: newUserInfos.homepage
                };
                console.log("Where is the response? 3");
                res.redirect("/sign");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", (req, res) => {
    if (req.body.emailAddress === "" || req.body.password === "") {
        res.render("login", {
            layout: "main",
            error: "Please fill all the fields bellow."
        });
    } else {
        db.getInfo(req.body.email).then(results => {
            if (results === undefined || results.length === 0) {
                res.render("login", {
                    layout: "main",
                    error: "Email or password incorrect."
                });
            } else {
                let hashedPassword = results.hashed_password;
                bc.checkPassword(req.body.password, hashedPassword).then(
                    checked => {
                        if (checked) {
                            req.session.id = results.id;
                            res.redirect("/sign");
                            console.log(checked);
                        } else {
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
    console.log("Where is the response in sign? 1");
    if (req.body.signatureName == "") {
        res.render("sign", {
            layout: "main",
            error: "Please sign in the space bellow."
        });
    } else {
        console.log("Where is the response in sign? 2");
        db.insertSignature(req.session.id, req.body.signatureName)
            .then(newUserSignature => {
                req.session.signatureId = newUserSignature.id;
                req.session.user = {
                    keySignature: newUserSignature.id
                };
                console.log("Where is the response in sign? 3");
                res.redirect("/thanks");
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

app.get("/thanks", (req, res) => {
    db.getSigners(req.session.id).then(results => {
        console.log("Where is the number of signers?", results.length);
        res.render("thankspage", {
            layout: "main2",
            nOfSigners: results.length
        });
    });
});

app.get("/signers", (req, res) => {
    db.getList().then(profile => {
        console.log(profile);
        res.render("signers", {
            layout: "main2",
            content: profile
        });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/signers/:areaofberlin", (req, res) => {
    db.getAreaOfBerlin(req.params.areaofberlin)
        .then(areaSigners => {
            console.log(areaSigners);
            res.render("areasofberlin", {
                layout: "main2",
                content: areaSigners,
                length: areaSigners.length,
                area_of_berlin: req.params.areaofberlin
            });
        })
        .catch(err => {
            console.log(err);
            res.render("areasofberlin", {
                layout: "main2",
                error: "There is no signatures yet in this area of Berlin."
            });
        });
});

app.listen(8080);
