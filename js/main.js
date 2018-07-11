(function() {

	CodeMirror.commands.autocomplete = function(cm) {
		CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
	};

	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		lineNumbers : true,
		mode : 'javascript',
		matchBrackets : true,
		extraKeys : {
			'Ctrl-Space' : 'autocomplete'
		}
	}), pending = null, output = document.getElementById('output'), bookmark = document.getElementById('bookmark');

	editor.on("cursorActivity", function() {
		editor.matchHighlight("CodeMirror-matchhighlight");
	});

	editor.on('change', function() {
		if (pending)
			clearTimeout(pending);
		pending = setTimeout(updated, 400);
	});

	var reIIFE = /(?:\/\/|#).*iife.*/;
	var reTITLE = /(?:\/\/|#).*title:(.*?)(\/\/|\r|\n)/;
	var reCOFFEE = /^#.*/;

	var marks = [], errLine = null;

	function updated() {
		var txt = editor.getValue(),
		    isCoffee = !!txt.match(reCOFFEE);

		if ((editor.getOption('mode') == 'javascript') != !isCoffee) {
			editor.setOption('mode', isCoffee ? 'coffeescript' : 'javascript');
		}

		if (window.uglify) {
			try {
				var code = isCoffee ? CoffeeScript.compile(txt) : txt,
				    iife = reIIFE.exec(txt),
				    title = reTITLE.exec(txt),
				    out, href, hash;

				if (title) {
					title = title[1];
				}

				hash = encodeURIComponent(txt);
		        bookmark.innerHTML = '<a href="#' + hash + '">(Save)</a>';
		        //location.hash = '#' +hash;

				if (errLine) {
					editor.setLineClass(errLine, null, null);
					errLine = null;
				}
				for ( var i = 0; i < marks.length; ++i) {
					marks[i].clear();
				}
				marks.length = 0;

				if (!JSHINT(code)) {

					output.innerHTML = JSHINT.report(false);
				} else {

					if (iife) {
						code = [ '(function(){', code, '})();' ].join('\n');
					}
					out = uglify(code);
//					href = encodeURI(out);
					href = out;
					href = href.replace(/%/g, '%25');
					href = href.replace(/"/g, '%22');
					output.innerHTML = (
						(isCoffee ? '<div><small>(Coffeescript detected)</small></div>' : '')
				        + '<a href="javascript:' + href
						+ '">'+(title?title:'Link')+'</a> (click to run / bookmark this!)'
						+'<div>' + out + '</div>'
					);
				}
			} catch (e) {
				var offset = iife ? 12 : 0, errorPos = editor
						.posFromIndex(e.pos - offset);

				errLine = editor.setLineClass(errorPos.line, null, "error");

				output.innerText = '' + e.message;
			}
		}
	}

	function init() {
		if (location.hash) {
			var h = location.hash.substr(1);
			h = decodeURIComponent(h);
			var isCoffee = !!h.match(reCOFFEE);
			editor.setValue(isCoffee ? h : js_beautify(h));
		}
		updated();
	}

	setTimeout(init, 20);
})();
