function parseData(value, key, map) {
    console.log(`map.get('${key}') = ${value}`);
}

window.onload = function () {
    chrome.runtime.sendMessage({ origin: "popup" }, function (response) {
        console.log(response.data)
        data = new Map(Object.entries(response.data));
        console.log(data);
        window.document.getElementById("data").innerHTML = data.forEach(parseData);
    });
}