const db = require("../db/db.js");
const bc = require("../conf/bcrypt.js");
const utils = require("../utils");

exports.registerUser = (req, res) => {
    let pass = "";
    if (
        req.body.firstname == "" ||
        req.body.lastname == "" ||
        req.body.emailAddress == "" ||
        req.body.password == ""
    ) {
        res.render("signup", {
            layout: "main",
            error: "Please fill all the fields below."
        });
    } else {
        bc.hashPassword(req.body.password)
            .then(hashedPassword => {
                pass = hashedPassword;
                return db
                    .registerUser(
                        req.body.firstname,
                        req.body.lastname,
                        req.body.email,
                        pass
                    )
                    .then(registeredUser => {
                        req.session.id = registeredUser.id;
                        console.log("registeredUser.id", registeredUser.id);
                        res.redirect("/profile");
                    });
            })
            .catch(err => {
                console.log(err);
                res.render("home", {
                    layout: "main",
                    error: "The email address already exists."
                });
            });
    }
};

exports.storeProfile = (req, res) => {
    if (req.body.age !== "" && !utils.isStringANumber(req.body.age)) {
        res.render("profile", {
            layout: "main",
            error: "Type just numbers in the field 'Age'."
        });
    } else {
        db.insertInfoUsers(
            req.session.id,
            req.body.age === "" ? undefined : parseInt(req.body.age),
            req.body.areaOfBerlin,
            req.body.homepage
        )
            .then(newUserInfos => {
                req.session.infos = newUserInfos.id;
                req.session.user = {
                    keyAge: newUserInfos.age,
                    keyAreaOfBerlin: newUserInfos.areaOfBerlin,
                    keyHomepage: newUserInfos.homepage
                };
                res.redirect("/home");
            })
            .catch(err => {
                console.log(err);
            });
    }
};

exports.updateProfile = (req, res) => {
    let pass = "";
    if (req.body.age != "" && !utils.isStringANumber(req.body.age)) {
        res.render("editprofile", {
            layout: "main2",
            error: "Type just numbers in the field 'Age'."
        });
    }
    if (req.body.password != "") {
        Promise.all([
            bc.hashPassword(req.body.password),
            db.editProfile(
                req.session.id,
                req.body.age === "" ? undefined : parseInt(req.body.age),
                req.body.areaOfBerlin,
                req.body.homepage
            ),
            db.editUser(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                req.body.hashedPassword
            )
        ])
            .then(hashedPassword => {
                pass = hashedPassword;
                db.editProfile(
                    pass,
                    req.session.id,
                    req.body.age === "" ? undefined : parseInt(req.body.age),
                    req.body.areaOfBerlin,
                    req.body.homepage
                ).then(editedUserProfile => {
                    req.session.id = editedUserProfile.id;
                    console.log("editedUserProfile.id", editedUserProfile.id);
                    res.redirect("/home");
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
};

exports.login = (req, res) => {
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
                            res.redirect("/home");
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
};

exports.storeSignature = (req, res) => {
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
};

exports.logout = (req, res) => {
    req.session = null;
    res.redirect("/");
};

exports.deleteSignature = (req, res) => {
    db.deleteSignature(req.session.id)
        .then(() => {
            res.redirect("/sign");
        })
        .catch(error => {
            console.log(error);
        });
};
