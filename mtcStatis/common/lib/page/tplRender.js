/**
 * @authors 12687185@qq.com
 * @date    2017/6/29/0029 11:20:57
 */
'use strict';
$.fn.tplRender = function (ops) {
	if (typeof(ejs) === "undefined") {
		throw new Error("tplRender.js依赖ejs.js;");
	}
	var $this = $(this);
	if ($this.length !== 1) {
		throw new Error("tplRender无法渲染,容器不唯一或者不存在;");
	}
	// 初始化
	var defaultVal = {};
	var defaults = $.extend({}, defaultVal, ops);
	//
	var url = defaults.url;
	var _data = defaults.data;
	var tpl = defaults.tpl;
	var dataSource = defaults.dataSource;
	var dataFilter = defaults.dataFilter;
	var bindEvent = defaults.bindEvent;
	var mounted = defaults.mounted;
	var count = defaults.count;
	var _paginationEnable = defaults.pagination || false;
	var $pagiWrap=defaults.pagination.el;
	//
	var _pageLength;
	var _dataSource;
	var _pagiData;
	var _pagination;
	var _page;
	var _recordsTotal;

	function setCount() {
		var width = $this.width();
		var height = $this.height();
		var newCount = typeof(count) === "function" ? count(width, height) : _dataSource.length;
		if (newCount % 1 === 0 && newCount !== _pageLength) {
			var temp = _pageLength;
			_pageLength = newCount;
			// 模块数量发生改变.重新获得数据并渲染
			if (typeof(temp) !== "undefined") {
				_pagiData.page=1;
				getRenderData();
			}
		}
	}

	// dataSource
	function getRenderData() {
		if (dataSource !== void 0 && toString.call(dataSource) === '[object Array]') {
			render();
		} else {
			var ajaxData = _data;
			ajaxData.pageLength = _pageLength;
			ajaxData.page = typeof(_pagination) === "undefined" ? 1 : _pagination.page;
			$.ajax({
				url: url,
				data: _data,
				success: function (data) {
					if (typeof(dataFilter) === "function") {
						var temp = dataFilter(data);
						if (typeof(temp) === "object" && Object.prototype.toString.call(temp).toLowerCase() === "[object object]" && !temp.length) {
							_dataSource = temp.dataSource;
							_pagiData = temp.pagination;
						} else {
							throw new Error("dataFilter必须返回json.当前返回值=" + _dataSource);
						}
					} else {
						_dataSource = data.dataSource;
						_pagiData = data.pagination;
					}
					//设置分页
					_recordsTotal = _pagiData.recordsTotal;
					// _page= _pagiData.page
					if (_pagination === void 0) {
						//
						setCount();
					}
					// 分页
					createPagination();
					// 有数据
					if (_dataSource.length > 0) {
						// render
						render();
					}
				}
			});
		}
	}

	$this.resize(function () {
		setCount();
	});

	// render
	function render() {
		var $dom = $();
		// // console.log("***************render   _pageLength=" + _pageLength);
		// 返回渲染数量
		for (var i = 0; i < _dataSource.length; i++) {
			var data = _dataSource[i];
			try {
				var html = ejs.render(tpl, {data: data});
				var dom = $(html);
				if (typeof(bindEvent) === "function") {
					bindEvent(dom, data);
				}
				$dom = $dom.add(dom);
				// $dom = typeof(bindEvent) === "function" ? $dom.add(bindEvent(dom, data)) : $dom.add(dom);
			} catch (e) {
				// console.log(_dataSource[i - 1]);
				throw new Error("tplRender第" + i + "个模块渲染错误.当前块数据=" + JSON.stringify(data));
			}
		}
		$this.children().remove();
		$dom.appendTo($this);
		// callback
		if (typeof(mounted) === "function") {
			mounted($dom);
		}
		// _pagination.data = {page: _pagiData.page};
	}

	// 创建分页
	function createPagination() {
		// $("#pagi").empty();
		// $("#pagi")
		if (_paginationEnable) {
			// console.log("createPagination   page== " + _pagiData.page);
			// console.log("createPagination   pageLength== " + _pageLength);
			// console.log("createPagination   _recordsTotal=== " + _recordsTotal);
			_pagination = new v.Pagination({
				el: $pagiWrap,
				start: 0,
				page: _pagiData.page,
				recordsTotal: _pagiData.recordsTotal,
				pageLength: _pageLength,
				// defaultPageSize: 40,
				// pagesize
				pageSizeOptions: [_pageLength, _pageLength * 2, _pageLength * 3, _pageLength * 4],
				// 是否可以改变 pageSize
				showSizeChanger: true,
				// 是否可以快速跳转至某页
				showQuickJumper: true,
				// 页码改变的回调 Function(data) data={page, pageSize}
				onChange: function (data) {
					// 转到第几页
					var page = data.page;
					_data.page = page;
					getRenderData();
					// console.log("加载第 " + page + " 页");
				}
			});
			// console.log("_pagiData.recordsTotal  "+_pagiData.recordsTotal);
			// _pagination.data = {page: _pagiData.page, recordsTotal: _pagiData.recordsTotal};
		}
	}

	// 初始化
	function init() {
		// 设置pageLength
		setCount();
		// 获得数据
		getRenderData();
	}

	init();
};

