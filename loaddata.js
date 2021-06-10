window.onload=function(){
    let bg = chrome.extension.getBackgroundPage();

    console.log(bg)
    returnData = bg.window.getTime();
    
    window.document.getElementById("data").innerHTML = returnData;
}