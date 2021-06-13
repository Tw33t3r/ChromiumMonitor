//Chromium Monitor
//An extension which tracks active browsing tabs
//Garrett Tvedt
//6-9-21

//ids has format (tabID, {url, startTime})
let ids = new Map();
var activeID = '';

chrome.runtime.onInstalled.addListener((reason)=>{
	let data = new Map();
	data.set('',0.0)
	chrome.storage.local.set({ 'map': Object.fromEntries(data) }, function () {
	});
})

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.origin == "popup") {
			chrome.storage.local.get(['map'], function (result) {
				savedData = new Map(Object.entries(result.map));
				console.log(savedData);
				sendResponse({ data: Object.fromEntries(savedData)});
			});
		}
		return true;
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
	let time = Date.now();
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
	chrome.storage.local.get(['map'], function (result) {
		data = new Map(Object.entries(result.map));
	//	console.log(data);
		var timeActive = data.get(url);
		if (typeof timeActive === "undefined") {
			data.set(url, time);
			chrome.storage.local.set({ 'map': Object.fromEntries(data) }, function () {
			});
		}
		else {
			timeActive = timeActive + time;
			data.set(url,timeActive);
			chrome.storage.local.set({ 'map': Object.fromEntries(data) }, function () {
			//	console.log("set url with " + url + " and time as " + timeActive);
			});
		}
	});
}