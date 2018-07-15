const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const hb = require("express-handlebars");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const {
    getFirstPage,
    getHome,
    getRegister,
    getProfile,
    getProfileEditor,
    getLoginView,
    getSignatureView,
    getThanksView,
    getSignersView,
    getSignersByAreaView,
    getAboutUs,
    getAboutUsLoggedIn,
    getLiveInBerlin
} = require("./controllers/views");
const {
    registerUser,
    storeProfile,
    updateProfile,
    login,
    storeSignature,
    logout,
    deleteSignature
} = require("./controllers/users");

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

const signedOutRedirect = (req, res, next) => {
    if (!req.session.id) {
        res.redirect("/");
    } else {
        next();
    }
};

const signedInRedirect = (req, res, next) => {
    if (req.session.id) {
        res.redirect("/home");
    } else {
        next();
    }
};

app.get("/profile", signedOutRedirect, getProfile);
app.post("/profile", signedOutRedirect, storeProfile);
app.get("/profile/edit", signedOutRedirect, getProfileEditor);
app.post("/profile/edit", signedOutRedirect, updateProfile);

app.get("/thanks", signedOutRedirect, getThanksView);

app.get("/sign", signedOutRedirect, getSignatureView);
app.post("/sign", signedOutRedirect, storeSignature);
app.get("/signers", signedOutRedirect, getSignersView);
app.get("/signers/:areaofberlin", signedOutRedirect, getSignersByAreaView);

app.get("/", signedInRedirect, getFirstPage);

app.get("/about", getAboutUs);

app.get("/about/loggedin", signedOutRedirect, getAboutUsLoggedIn);

app.get("/home", signedOutRedirect, getHome);

app.get("/register", signedInRedirect, getRegister);
app.post("/register", signedInRedirect, registerUser);

app.get("/login", getLoginView);
app.post("/login", login);

app.get("/logout", signedOutRedirect, logout);

app.get("/delete", deleteSignature);

app.get("/liveinberlin", signedInRedirect, getLiveInBerlin);

app.listen(process.env.PORT || 8080);
