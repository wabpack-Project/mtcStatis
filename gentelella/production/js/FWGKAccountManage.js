$(".list-page").paging({
	pageNum:1,
	totalNum:7,
	totalList:17,
	callback: function (num) {
		console.log(num)
	}
});