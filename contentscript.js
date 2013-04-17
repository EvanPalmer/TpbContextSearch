(function(){
	window.onload = function(){
		var thisIsImdb = window.location.href.indexOf('//www.imdb.com/') > 0;
		if(thisIsImdb){
			// add bootstrap JS from CDN
			$.getScript("//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js", function(){
			    $.noop;
			});

			// make room for the new DDL
			$('#prometer_container').children().remove();

			var searchTerm = $('h1.header').text().replace(/\s+/g, ' ').trim();

			var searchUrl = 'http://thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0'
			$.get(searchUrl, function(data){
				debugger;

                var resultTds = $(data).find('a[title="Download this torrent using magnet"]:lt(5)').closest('td');

                // Handle no results from TPB
                if(resultTds.length === 0)  {
                  return;
                }

                // Sweet! We have some results!

				$('#prometer_container').append($('<ul class="nav nav-pills">')
					.append($('<li class="dropdown">')
						.append($('<a class="dropdown-toggle" data-toggle="dropdown" href="#">Download<b class="caret"></b>'))
						.append($('<ul class="dropdown-menu">')
							.append($('<li>').append('<a target="_blank" href="http://thepiratebay.se/search/' + encodeURIComponent(searchTerm) + '/0/7/0">Search TPB for "' + searchTerm + '"</a>'))
							.append($('<li class="divider">')))));

				resultTds.each(function(i, e) { 
					var description = $(e).find('font.detDesc').text();
					var sizeExtractionRegex = /.+Size (.+?),.+/i;
					var size = sizeExtractionRegex.exec(description)[1];
					var linkName = $(e).find('a.detLink').text();
					var contextMenuTitle = '(' + size + ') ' + linkName;
					var magnetUrl = $(e).find('a[title="Download this torrent using magnet"]').attr('href');
					
					$('#prometer_container .dropdown-menu').append($('<li>').append($('<a>').attr('href', magnetUrl).append(contextMenuTitle)));
				});
			});
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


