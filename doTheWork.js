// NOTE: Could use Url Filter to do something to IMDB http://developer.chrome.com/extensions/events.html#type-UrlFilter
// parse when the dom is loaded
// document.addEventListener('DOMContentLoaded', function () {
//      document.querySelector('#showAlert').addEventListener('change', changeHandler);
//});
function genericOnClick(searchText) {
	var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(searchText) + '/0/7/0'
	chrome.tabs.create({'url': searchUrl}, function(tab) {
	    // Tab opened.
	  });

	// var xhr = new XMLHttpRequest();
	// xhr.open("GET", searchUrl, true);
	// xhr.onreadystatechange = function() {
	// 	if (xhr.readyState == 4) {
	// 		// remember to handle no results
	// 		$(xhr.responseText).find('a[title="Download this torrent using magnet"]:lt(5)').each(function(i, e) { 
	// 			alert(e);
	// 			//alert($(e).attr('href'));
	// 			//chrome.contextMenus.create({'title': 'Get this one', 'parentId': id, 'onclick': loadMagnetLink });
	// 		});
	// 	}
	// }
	// xhr.send();

	// console.log("item " + info.menuItemId + " was clicked");
	// console.log("info: " + JSON.stringify(info));
	// console.log("tab: " + JSON.stringify(tab));
}

function loadMagnetLink(magnetLink){
	alert(magnetLink);
}


var parentId = 0;
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
        case "page-clicked":
            // execute the content script
            console.log(request.selectedText);
           	if(request.selectedText.length <= 0){
           		// don't bother doing anything if they didn't select nothing
           		return;
           	}
			var title = "Search TPB for '" + request.selectedText + "'";
			chrome.contextMenus.removeAll(function(){});
			parentId = chrome.contextMenus.create({"title": title, "contexts":["selection"], "onclick": genericOnClick(request.selectedText)});

			var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(request.selectedText) + '/0/7/0'

			var xhr = new XMLHttpRequest();
			xhr.open("GET", searchUrl, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					// remember to handle no results
					$(xhr.responseText).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td').each(function(i, e) { 
						//alert(e);
						console.log($(e).find('a.detLink').text());
						console.log($(e).find('a[title="Download this torrent using magnet"]').text());
						chrome.contextMenus.create({'title': $(e).find('a.detLink').text(), 'parentId': parentId, 'contexts':[context], 'onclick': loadMagnetLink($(e).find('a[title="Download this torrent using magnet"]'))});
						//alert($(e).attr('href'));
						//chrome.contextMenus.create({'title': 'Get this one', 'parentId': id, 'onclick': loadMagnetLink });
					});
				}
			}
			xhr.send();

            sendResponse({}); // sending back empty response to sender
            break;
        default:
            // helps debug when request directive doesn't match
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);


chrome.tabs.onUpdated.addListener(function(tab) {
	chrome.tabs.executeScript(tab.id, { // defaults to the current tab
		file: "contentscript.js", // script to inject into page and run in sandbox
		allFrames: false // This injects script into iframes in the page and doesn't work before 4.0.266.0.
	});

	console.log('Script injected');
});


chrome.tabs.onCreated.addListener(function(tab) {
	consol.log('tab created');
	// chrome.windows.getCurrent(function(win)
	// {
	//     chrome.tabs.getAllInWindow(win.id, function(tabs)
	//     {
	//         // Should output an array of tab objects to your dev console.
	//         console.debug(tabs);
	//     });
	// });
});
