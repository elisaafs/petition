const canvas = document.getElementById("signature-canvas-new");
const ctx = canvas.getContext("2d");
const hiddenInput = document.getElementById("signature-input-new");

canvas.addEventListener("mousedown", function(e) {
    ctx.beginPath();
    var x = e.offsetX;
    var y = e.offsetY;
    ctx.moveTo(x, y);
    canvas.addEventListener("mousemove", move);
    function move(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        console.log(x, y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    document.addEventListener("mouseup", function() {
        canvas.removeEventListener("mousemove", move);
        hiddenInput.value = canvas.toDataURL();
    });
});
