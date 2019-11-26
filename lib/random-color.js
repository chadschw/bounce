
function RandBetween(low, high) {
    var spread = high - low;
    var num = Math.random() * spread;
    return num + low;
}

function RandomColor() {
    return "rgba(" + 
        RandBetween(0, 255) + "," +
        RandBetween(0, 255) + "," +
        RandBetween(0, 255) + "," +
        Math.random(0, 1) + ")";
}