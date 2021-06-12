function parseData(value, key, map) {
    if(key != '' && key != 'extensions' && key != 'newtab'){
        var par = window.document.createElement("p");
        var time = Math.round(value /1000);  
        par.innerHTML = "<p>" + `${key}` + ": " + time + "s </p>";
        document.body.appendChild(par);
    }
}

window.onload = function () {
    chrome.runtime.sendMessage({ origin: "popup" }, function (response) {
        data = new Map(Object.entries(response.data));
        data.forEach(parseData)
        window.document.getElementById("data").innerHTML = "Recorded Data is:";
    });
}