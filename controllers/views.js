const db = require("../db/db.js");

exports.getAboutUs = (req, res) => {
    res.render("aboutus", {
        layout: "main"
    });
};

exports.getAboutUsLoggedIn = (req, res) => {
    res.render("aboutusIfLogin", {
        layout: "main"
    });
};

exports.getFirstPage = (req, res) => {
    res.render("firstpage", {
        layout: "main"
    });
};

exports.getRegister = (req, res) => {
    res.render("signup", {
        layout: "main"
    });
};

exports.getProfile = (req, res) => {
    res.render("profile", {
        layout: "main"
    });
};

exports.getProfileEditor = (req, res) => {
    db.getInfoToEditProfile(req.session.id).then(allUsers => {
        res.render("editprofile", {
            layout: "main",
            content: allUsers
        });
    });
};

exports.getHome = (req, res) => {
    res.render("home", {
        layout: "main"
    });
};

exports.getLoginView = (req, res) => {
    res.render("login", {
        layout: "main"
    });
};

exports.getSignatureView = (req, res) => {
    db.getSignatureByUserId(req.session.id).then(results => {
        if (results.length > 0) {
            res.redirect("/thanks");
        } else {
            res.render("sign", {
                layout: "main"
            });
        }
    });
};

exports.getThanksView = (req, res) => {
    Promise.all([
        db.getSigners(req.session.id),
        db.getSignatureByUserId(req.session.id)
    ]).then(results => {
        const signersResult = results[0];
        const signatureResult = results[1];
        console.log("Where is the number of signers?", signersResult.length);
        res.render("thankspage", {
            layout: "main",
            nOfSigners: signersResult.length,
            signature:
                signatureResult.length > 0
                    ? signatureResult[0].signature
                    : undefined
        });
    });
};

exports.getSignersView = (req, res) => {
    db.getList().then(profile => {
        console.log(profile);
        res.render("signers", {
            layout: "main",
            content: profile
        });
    });
};

exports.getSignersByAreaView = (req, res) => {
    db.getAreaOfBerlin(req.params.areaofberlin)
        .then(areaSigners => {
            console.log(areaSigners);
            res.render("areasofberlin", {
                layout: "main",
                content: areaSigners,
                length: areaSigners.length,
                area_of_berlin: req.params.areaofberlin
            });
        })
        .catch(err => {
            console.log(err);
            res.render("areasofberlin", {
                layout: "main",
                error: "There is no signatures yet in this area of Berlin."
            });
        });
};

exports.logout = (req, res) => {
    req.session = null;
    res.redirect("/");
};

exports.getLiveInBerlin = (req, res) => {
    res.render("liveinberlin", {
        layout: "main"
    });
};
