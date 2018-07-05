const canvas = document.getElementById("signature-canvas");
const ctx = canvas.getContext("2d");
const hiddenInput = document.getElementById("signature-input");

canvas.addEventListener("mousedown", function(e) {
    ctx.beginPath();
    var x = e.clientX - e.target.offsetLeft;
    var y = e.clientY - e.target.offsetTop;
    ctx.moveTo(x, y);
    canvas.addEventListener("mousemove", move);
    function move(e) {
        var x = e.clientX - e.target.offsetLeft;
        var y = e.clientY - e.target.offsetTop;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    document.addEventListener("mouseup", function() {
        canvas.removeEventListener("mousemove", move);
        hiddenInput.value = canvas.toDataURL();
    });
});
