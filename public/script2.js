const buttonGoBackHome = document.getElementById("home-button");
const buttonRedirectProfile = document.getElementById(
    "button-redirect-profile"
);
const buttonEditProfile = document.getElementById("button-edit-profile");
const buttonGoBack = document.getElementById("goback");
const buttonGoToRegister = document.getElementById("signup-button");
const buttonLogin = document.getElementById("login-button");
const buttonLogout = document.getElementById("logout-button");
const buttonSignPetition = document.getElementById("button-sign-petition");
const buttonDeleteSignature = document.getElementById(
    "button-delete-signature"
);
const bvgHeart = document.getElementById("bvg-heart");
const buttonSignUp = document.getElementById("signup-button-bottom");
const buttonAboutUs = document.getElementById("aboutus-button");
const buttonAboutUsLoggedIn = document.getElementById("aboutus-button-logged");

if (buttonAboutUsLoggedIn) {
    buttonAboutUsLoggedIn.addEventListener("click", function() {
        window.location = "/aboutus/loggedin";
    });
}

if (buttonAboutUs) {
    buttonAboutUs.addEventListener("click", function() {
        window.location = "/aboutus";
    });
}

if (buttonSignUp) {
    buttonSignUp.addEventListener("click", function() {
        window.location = "/register";
    });
}

if (bvgHeart) {
    bvgHeart.addEventListener("click", function() {
        window.location = "/";
    });
}

if (buttonGoBackHome) {
    buttonGoBackHome.addEventListener("click", function() {
        window.location = "/";
    });
}

if (buttonRedirectProfile) {
    buttonRedirectProfile.addEventListener("click", function() {
        window.location = "/profile/edit";
    });
}

if (buttonEditProfile) {
    buttonEditProfile.addEventListener("click", function() {
        window.location = "/profile/edit";
    });
}

if (buttonGoBack) {
    buttonGoBack.addEventListener("click", function() {
        window.history.back();
    });
}

if (buttonGoToRegister) {
    buttonGoToRegister.addEventListener("click", function() {
        window.location = "/register";
    });
}

if (buttonLogin) {
    buttonLogin.addEventListener("click", function() {
        window.location = "/login";
    });
}

if (buttonLogout) {
    buttonLogout.addEventListener("click", function() {
        window.location = "/logout";
    });
}

if (buttonSignPetition) {
    buttonSignPetition.addEventListener("click", function() {
        window.location = "/sign";
    });
}

if (buttonDeleteSignature) {
    buttonDeleteSignature.addEventListener("click", function() {
        window.location = "/delete";
    });
}
