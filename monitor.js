//Chromium Monitor
//An extension which tracks active browsing tabs
//Garrett Tvedt
//6-9-21

//ids has format (tabID, {url, startTime})
let ids = new Map();
var activeID = '';

//https://developer.chrome.com/docs/extensions/mv3/messaging/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		sendResponse({

		});
	}
);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	url = changeInfo.url;
	if (!url || ['chrome://'].some(f => url.startsWith(f))) return;
	url = url.split(/\/\/|[?#\/]/)[1];
	newActive(tab.id, url);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	setTimeout(() => {
		chrome.tabs.get(activeInfo.tabId, function (tab) {
			url = tab.url;
			url = url.split(/\/\/|[?#\/]/)[1];
			newActive(tab.id, url);
		});
	}, 1000);
});

function newActive(id, url) {
	let time = performance.now();
	if (!ids.has(id)) {
		ids.set(id, { url, time });
		if (activeID != '') {
			let idsReturn = ids.get(activeID);
			let oldUrl = idsReturn.url;
			let oldTime = idsReturn.time;
			let activeTime = time - oldTime;
			recordTime(oldUrl, activeTime);
		}
		activeID = id;
	}
	else {
		if (activeID != id) {
			let idsReturn = ids.get(activeID);
			let oldUrl = idsReturn.url;
			let oldTime = idsReturn.time;
			ids.set(id, { url, time });
			let activeTime = time - oldTime;
			recordTime(oldUrl, activeTime);
			activeID = id;
		}
		else {
			let idsReturn = ids.get(id);
			let oldUrl = idsReturn.url;
			let oldTime = idsReturn.time;
			if (url != oldUrl) {
				ids.set(id, { url, time });
				let activeTime = time - oldTime;
				recordTime(oldUrl, activeTime);
				activeId = id;
			}
		}
	}
}

function recordTime(url, time) {
	//Unsure if data sanitation is necessary for url, storage area is unencrypted anyway
	//key:: url, value:: time (total time active)
	chrome.storage.local.get('url', function (result) {
		var timeActive = result.url;
		if (typeof timeActive === "undefined") {
			chrome.storage.local.set({ url: time }, function () {
				console.log("data is: " + time + " " + url)
			});
		}
		else {
			timeActive = timeActive + time;
			chrome.storage.local.set({ url: timeActive }, function () {
				console.log("data is: " + timeActive + " " + url)
			});
		}
	});
}