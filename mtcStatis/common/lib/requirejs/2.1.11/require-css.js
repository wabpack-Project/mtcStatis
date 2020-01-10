/**
 * @description require.js 配合使用的简单的css加载插件
 */
// 加载css文件（可以防止重复加载）
var __loadCssFn = function(cssSrc, parent, id) {
	//loadCallback(newlyLoaded, cssUrl)
	var loadCallback = null;
	if(typeof parent == "function") {
		loadCallback = parent;
		parent = null;
	}
	//
	if(typeof parent == "string") {
		var tmpParents = document.getElementsByTagName(parent);
		if(tmpParents.length > 0) {
			parent = tmpParents[0];
		} else {
			parent = null;
		}
	}
	if(parent == null) {
		parent = document.head;
	}
	//
	if(typeof id == "function") {
		loadCallback = id;
		id = null;
	}
	//
	if(id == null) {
		// 自动生成id;
		var lastSlashIndex = cssSrc.lastIndexOf("/");
		if(lastSlashIndex == -1) {
			lastSlashIndex = cssSrc.lastIndexOf("\\");
		}
		var dotIndex = -1;
		if(lastSlashIndex == -1) {
			dotIndex = cssSrc.indexOf(".css", 0);
			if(dotIndex == -1) {
				dotIndex = cssSrc.indexOf("?", 0);
			}
		} else {
			dotIndex = cssSrc.indexOf(".css", lastSlashIndex + 1);
			if(dotIndex == -1) {
				dotIndex = cssSrc.indexOf("?", lastSlashIndex + 1);
			}
		}
		id = cssSrc;
		if(dotIndex != -1) {
			id = cssSrc.substring(0, dotIndex) + ".css";
		}
		// id = replaceStr(id, "\" );
	}
	// console.log("link css id : " + id);
	var allLinks = document.getElementsByTagName("link");
	var existedCss = null;
	for(var i = 0, c = allLinks.length; i < c; i++) {
		var tmpLink = allLinks[i];
		if(tmpLink.id == id) {
			existedCss = tmpLink;
			break;
		}
	}
	if(existedCss != null) {
		if(existedCss.href == null || existedCss.href == "") {
			if(loadCallback != null) {
				existedCss.onload = function() {
					loadCallback(true, cssSrc);
				};
			}
			existedCss.href = cssSrc;
		} else {
			//console.log("已经加载过：" + cssSrc);
			if(loadCallback != null) {
				loadCallback(false, cssSrc);
			}
		}
		return;
	}
	//
	var link = document.createElement('link');
	link.type = "text/css";
	//link.charset = 'utf-8';
	link.rel = 'stylesheet';
	link.id = id;
	link.href = cssSrc;
	if(loadCallback != null) {
		link.onload = function() {
			loadCallback(true, cssSrc);
		};
	}
	parent.appendChild(link);
}

if(typeof define === "function" && define.amd) {
	define("css", [], function() {
		var loadCss = __loadCssFn;
		return {
			normalize: function(name, normalize) {
				return normalize(name);
			},

			load: function(name, req, onload, config) {
				var url = req.toUrl(name + '.css');
				//
				loadCss(url, function(newLoad, cssSrc) {
					//
					if(newLoad) {
						console.log("已经加载：" + cssSrc);
					} else {
						console.log("已经存在：" + cssSrc);
					}
					//
					onload(url);
				}, url);
			}

		};
	});
} else {
	//非 require.js 环境下直接暴露出去用以加载css
	window["loadCss"] = __loadCssFn;
}