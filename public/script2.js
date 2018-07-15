const buttonGoToRegister = document.getElementById("signup-button");
const buttonSignPetition = document.getElementById("button-sign-petition");
const buttonDeleteSignature = document.getElementById(
    "button-delete-signature"
);
const bvgHeart = document.getElementById("bvg-heart");
const buttonSignUp = document.getElementById("signup-button-bottom");
const buttonYes = document.getElementById("yes-button");

if (buttonYes) {
    buttonYes.addEventListener("click", function() {
        window.location = "/register";
    });
}

if (buttonSignUp) {
    buttonSignUp.addEventListener("click", function() {
        window.location = "/liveinberlin";
    });
}

if (bvgHeart) {
    bvgHeart.addEventListener("click", function() {
        window.location = "/";
    });
}

if (buttonGoToRegister) {
    buttonGoToRegister.addEventListener("click", function() {
        window.location = "/liveinberlin";
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
