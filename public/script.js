const canvas = document.getElementById("signature-canvas");
const ctx = canvas.getContext("2d");
const hiddenInput = document.getElementById("signature-input");
const buttonEditProfile = document.getElementById("button-edit-profile");

canvas.addEventListener("mousedown", function(e) {
    ctx.beginPath();
    var x = e.clientX - this.offsetLeft - 8;
    var y = e.clientY - this.offsetTop - 8;
    ctx.moveTo(x, y);
    canvas.addEventListener("mousemove", move);
    function move(e) {
        var x = e.clientX - this.offsetLeft - 8;
        var y = e.clientY - this.offsetTop - 8;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    document.addEventListener("mouseup", function() {
        canvas.removeEventListener("mousemove", move);
        hiddenInput.value = canvas.toDataURL();
    });
});

buttonEditProfile.addEventListener("click", function(e) {
    window.location = "/profile/edit";
});
