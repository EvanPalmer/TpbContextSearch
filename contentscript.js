(function(){
	window.onload = function(){
		var thisIsImdb = window.location.href.indexOf('//www.imdb.com/') > 0;
		if(thisIsImdb){
			// add bootstrap JS from CDN
			$.getScript("//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js", function(){
			    $.noop;//alert("Running boostrap!");
			});

			// make room for the new DDL
			$('#prometer_container').children().remove();

			var searchTerm = $('h1.header').text().replace(/\s+/g, ' ').trim();

			$('#prometer_container').append('<div id="tpb-context-search-download-container"><ul class="nav nav-pills">\
											  <li class="dropdown">\
											    <a class="dropdown-toggle"\
											       data-toggle="dropdown"\
											       href="#">\
											        Download\
											        <b class="caret"></b>\
											      </a>\
											    <ul class="dropdown-menu">\
											      <li><a target="_blank" href="http://thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0">Search TPB for "' + searchTerm + '"</a></li>\
												  <li class="divider"><a href="#">(1.46Mb) The Shawshank Redemption QWE0qwe</a></li>\
												  <li><a href="#">(1.46Mb) The Shawshank Redemption QWE0qwe</a></li>\
												  <li><a href="#">(7.26Gb) The.Shawshank.Redemption BluRay</a></li>\
												  <li><a href="#">(700Mb) The Shawshank Redemption Crap quality</a></li>\
												  <li><a href="#">(1.46Mb) The Shawshank Redemption QWE0qwe</a></li>\
											    </ul>\
											  </li>\
											</ul>');
		};

		window.onmouseup = function(e){ 
			var x = window.getSelection().toString();
			chrome.extension.sendMessage({directive: "page-clicked", selectedText: x}, function(response) {
		        // this.close(); 
				// alert('Just sent: ' + x);
		    });
		};
	};
}());


