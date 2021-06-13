var bar = 0;

function parseData(value, key, map) {
    if (key != '' && key != 'extensions' && key != 'newtab' && key != 'undefined') {
        var time = Math.round(value / 1000);
        draw(key, time);
    }
}

window.onload = function () {
    chrome.runtime.sendMessage({ origin: "popup" }, function (response) {
        data = new Map(Object.entries(response.data));
        data.forEach(parseData)
        window.document.getElementById("data").innerHTML = "Recorded Data is:";
    });
}

function draw(url, time) {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = "18px Arial";
    ctx.fillText(url, 5, 20*bar+37.5*bar);
    if (bar % 4 == 0) {
        ctx.fillStyle = 'rgb(255, 221, 0)';
    }
    else if(bar % 4 == 1){
        ctx.fillStyle = 'rgb(102, 204, 0)';
    }
    else if(bar % 4 == 2){
        ctx.fillStyle = 'rgb(0, 153, 255)';
    }
    else{
        ctx.fillStyle = 'rgb(255, 51, 0)';
    }
    ctx.fillRect(0, 20*(bar+1) + 37.5*bar, time, 37.5);
    bar++;
}