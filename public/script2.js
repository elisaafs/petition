const buttonRedirectProfile = document.getElementById(
    "button-redirect-profile"
);

if (buttonRedirectProfile) {
    buttonRedirectProfile.addEventListener("click", function() {
        window.location = "/profile/edit";
    });
}
