//console.log(this);
onmessage = function(e) {
    console.log('yes', e.data[0]);
    let point = e.data[0];
    let bufferedpoints = e.data[1];
    inside = e.data[2];
    var inflok;
    for (let i = 0; i < bufferedpoints.length; i++) {
        inflok = inside(point, bufferedpoints[i]);
        if (inflok) {
            document.getElementById("log").innerText = 'YES';
            break
        } else {
            document.getElementById("log").innerText = 'NO';
        }
    }
}