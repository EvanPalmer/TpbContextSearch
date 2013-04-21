(function(){
//	debugger ;
		window.onmouseup = function(e){ 
//			debugger ;
			var x = window.getSelection().toString();
			chrome.extension.sendMessage({directive: "page-clicked", selectedText: x}, function(response) {
		    });
	};
}());


