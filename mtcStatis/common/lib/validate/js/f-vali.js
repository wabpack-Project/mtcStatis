require([], function() {
    function f_vali() {
        $("body").on("mouseenter", ".f-vali", f_valiHandler);

        function f_valiHandler(e) {
            var scW = document.documentElement.clientWidth;
            var $tipWrap = $(e.currentTarget);
            var $f_error = $tipWrap.find(".f-error");
            if ($f_error.length == 1) {
                var $tip = $tipWrap.find(".f-errorTip");
                var $arrow = $tipWrap.find("div[class*='f-errorTiparrow']");
                var iconW = $tipWrap.find(".f-error").width();
                var w = $tip.outerWidth(true);
                var ol = $tip.offset().left;
                var pl = $tip.position().left;
                var tempLeft = parseInt($tip.css("left"));
                if (typeof($tip.data("pl")) == "undefined") {
                    $tip.data("pl", pl);
                }
                var tempTop = parseInt($tip.css("top"));
                var temp = pl < 0 ? Math.abs(w) * 2 + ol : ol + w;

                if (temp > scW) {
                    tempLeft = -w + iconW+5;
                    $arrow.addClass("f-errorTiparrowri");
                } else {
                    tempLeft = $tip.data("pl");
                    $arrow.removeClass("f-errorTiparrowri");
                }
                if ($tip.height() > 30 && tempTop == -40) {
                    tempTop -= ($tip.height() - 18);
                }
                $tip.css({ "left": tempLeft, "top": tempTop });
            }
        }
    }
    f_vali();
});
