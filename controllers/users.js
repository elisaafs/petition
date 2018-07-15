const db = require("../db/db.js");
const bc = require("../conf/bcrypt.js");
const utils = require("../utils");

exports.registerUser = (req, res) => {
    let pass = "";
    if (
        req.body.firstname === "" ||
        req.body.lastname === "" ||
        req.body.emailAddress === "" ||
        req.body.password === ""
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
        return;
    }

    db.insertInfoUsers(
        req.session.id,
        req.body.age === "" ? undefined : parseInt(req.body.age),
        req.body.areaOfBerlin,
        utils.sanitizeHomepageUrl(req.body.homepage)
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
};

function updateProfileInternal(newUserData, newProfileData, req, res) {
    console.log(newProfileData);
    Promise.all([
        db.editProfile(
            req.session.id,
            newProfileData.age,
            newProfileData.areaOfBerlin,
            newProfileData.homepage
        ),
        db.editUser(
            newUserData.firstName,
            newUserData.lastName,
            newUserData.email,
            newUserData.hashedPassword,
            req.session.id
        )
    ]).then(() => {
        res.redirect("/home");
    });
}

exports.updateProfile = (req, res) => {
    if (req.body.age != "" && !utils.isStringANumber(req.body.age)) {
        res.render("editprofile", {
            layout: "main",
            error: "Type just numbers in the field 'Age'."
        });
        return;
    }

    db.getInfoToEditProfile(req.session.id).then(userAndProfileData => {
        const newUserData = {
            firstName: req.body.firstname || userAndProfileData.first_name,
            lastName: req.body.lastname || userAndProfileData.last_name,
            email: req.body.email || userAndProfileData.email,
            hashedPassword: userAndProfileData.hashed_password
        };

        const newProfileData = {
            age: userAndProfileData.age,
            areaOfBerlin:
                req.body["area-of-berlin"] || userAndProfileData.area_of_berlin,
            homepage: userAndProfileData.homepage
        };

        if (req.body.age) {
            newProfileData.age = parseInt(req.body.age);
        }
        if (req.body.homepage) {
            newProfileData.homepage = utils.sanitizeHomepageUrl(
                req.body.homepage
            );
        }

        if (req.body.password != "") {
            bc.hashPassword(req.body.password).then(hashedPassword => {
                newUserData.hashedPassword = hashedPassword;
                updateProfileInternal(newUserData, newProfileData, req, res);
            });
        } else {
            updateProfileInternal(newUserData, newProfileData, req, res);
        }
    });
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
