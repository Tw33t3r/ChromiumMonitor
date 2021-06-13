var bar = 0;

function parseData(value, key, map) {
    if (key != '' && key != 'extensions' && key != 'newtab' && key != 'undefined') {
        var time = Math.round(value / 1000);
        var par = window.document.createElement("p");
        par.innerHTML = key + ": " + time + "s";
        var canvas = window.document.createElement("canvas");
        canvas.style.width = 'inherit';
        canvas.style.height = '37.5px';
        var ctx = canvas.getContext('2d');
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
        ctx.fillRect(0, 0, time, 500);
        bar++;
        var container = window.document.getElementById("data-container");
        container.appendChild(par);
        container.appendChild(canvas);
    }
}

window.onload = function () {
    chrome.runtime.sendMessage({ origin: "popup" }, function (response) {
        data = new Map(Object.entries(response.data));
        data.forEach(parseData)
        window.document.getElementById("data").innerHTML = "Total Time Spent on Websites:";
    });
}