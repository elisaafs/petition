const buttonGoBackHome = document.getElementById("gobackHome");
const buttonRedirectProfile = document.getElementById(
    "button-redirect-profile"
);
const buttonEditProfile = document.getElementById("button-edit-profile");
const buttonGoBack = document.getElementById("goback");
const buttonGoToRegister = document.getElementById("register-button");
const buttonLogin = document.getElementById("login-button");

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
