setSamples({
	'samples' : [
			{
				'name' : 'open window from data url',
				'code' : [
						"window.open('data:text/html;charset=utf-8,%3C%21DOCTYPE%20html%3E%0D%0A%3Cht'+",
						"'ml%20lang%3D%22en%22%3E%0D%0A%3Chead%3E%3Ctitle%3EEmbedded%20Window%3C%2F'+",
						"'title%3E%3C%2Fhead%3E%0D%0A%3Cbody%3E%3Ch1%3E42%3C%2Fh1%3E%3C%2Fbody%3E%0'+",
						"'A%3C%2Fhtml%3E%0A%0D%0A','_blank','height=300,width=400'); " ]
			},
			{
				'name' : 'hello world variations',
				'code' : [
						"//iife",
						"/** /",
						"function hello1(a) {",
						"  alert(a);",
						"}",
						"",
						"hello1('world!');",
						"// */",
						"",
						"/**/",
						"function hello(a) {",
						"window.open('data:text/html;'+ encodeURI('<html><body>'+a+'</body></html>'));",
						"}", "hello2('world');", "// */" ]
			} ]
});
