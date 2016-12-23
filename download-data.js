var request = require("request"),
	cheerio = require("cheerio"),
	fs = require("fs");

request("https://www9.atwiki.jp/f_go/pages/160.html", function(err, res, body) {
	if (err) throw err;
	
	var $ = cheerio.load(body),
		table = [];
	
	$("#wikibody table").find("tr").each(function(){
		table.push($(this).children().map(function(){
			return $(this).contents().map(function(){
				if (this.data) {
					return this.data;
				}
				if (this.name == "br") {
					return "\n";
				}
				return $(this).text();
			}).get().join("").trim();
		}).get());
	});
	
	var out = {};
	
	for (var row of table) {
		var [id, rare, name, cls, ...asc] = row;
		if (!+id || +id <= 1) continue;
		
		out[+id] = {
			name: name,
			rare: rare,
			cls: cls,
			ascension: asc.map(a => a.split("\n").reduce((o, l) => {
				if (l.endsWith("QP")) {
					l = l.replace(/,|QP/g, "");
					o.QP = +l;
				} else {
					var i = l.lastIndexOf("x");
					if (i < 0) {
						o[l] = 1;
					} else {
						var name = l.substring(0, i),
							num = l.substring(i + 1);
						o[name] = +num;
					}
				}
				return o;
			}, {}))
		};
	}
	
	fs.writeFileSync("fgo-skillitem/data-ascension.js", "ascension = " + JSON.stringify(out, null, "\t"));
});