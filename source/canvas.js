(function() {
	var canvas = $('#canvas');
	if (!canvas[0].getContext) {
		$("#error").show();
		return false
	}
	var width = canvas.width();
	var height = canvas.height();
	canvas.attr("width", width);
	canvas.attr("height", height);
	console.log(width)
	console.log(height);
	var opts = {
		seed: {
			x: width / 2 - 20,
			color: "rgb(190, 26, 37)",
			scale: 2
		},
		branch: [[535, 680, 570, 250, 500, 200, 30, 100, [[540, 500, 455, 417, 340, 400, 13, 100, [[450, 435, 434, 430, 394, 395, 2, 40]]], [550, 445, 600, 356, 680, 345, 12, 100, [[578, 400, 648, 409, 661, 426, 3, 80]]], [539, 281, 537, 248, 534, 217, 3, 40], [546, 397, 413, 247, 328, 244, 9, 80, [[427, 286, 383, 253, 371, 205, 2, 40], [498, 345, 435, 315, 395, 330, 4, 60]]], [546, 357, 608, 252, 678, 221, 6, 100, [[590, 293, 646, 277, 648, 271, 2, 80]]]]]],
		bloom: {
			num: 700,
			width: 1080,
			height: 650,
		},
		footer: {
			width: 1200,
			height: 5,
			speed: 10,
		}
	};
	var tree = new Tree(canvas[0], width, height, opts);
	var seed = tree.seed;
	var foot = tree.footer;
	var hold = 1;
	canvas.click(function(e) {
		console.log('click');
		var offset = canvas.offset(),
		x,
		y;
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
		if (seed.hover(x, y)) {
			hold = 0;
			canvas.unbind("click");
			canvas.unbind("mousemove");
			canvas.removeClass('hand');
			$("#loveBgm")[0].play();    //播放音乐
		}
	}).mousemove(function(e) {
		var offset = canvas.offset(),
		x,
		y;
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
		canvas.toggleClass('hand', seed.hover(x, y));
	});
	var seedAnimate = eval(Jscex.compile("async",
	function() {
		seed.draw();
		while (hold) {
			$await(Jscex.Async.sleep(10));
		}
		while (seed.canScale()) {
			seed.scale(0.95);
			$await(Jscex.Async.sleep(10));
		}
		while (seed.canMove()) {
			seed.move(0, 2);
			foot.draw();
			$await(Jscex.Async.sleep(10));
		}
	}));
	var growAnimate = eval(Jscex.compile("async",
	function() {
		do {
			tree.grow();
			$await(Jscex.Async.sleep(10));
		} while ( tree . canGrow ());
	}));
	var flowAnimate = eval(Jscex.compile("async",
	function() {
		do {
			tree.flower(2);
			$await(Jscex.Async.sleep(10));
		} while ( tree . canFlower ());
	}));
	var moveAnimate = eval(Jscex.compile("async",
	function() {
		tree.snapshot("p1", 240, 0, 610, 680);
		while (tree.move("p1", 500, 0)) {
			foot.draw();
			$await(Jscex.Async.sleep(10));
		}
		foot.draw();
		tree.snapshot("p2", 500, 0, 610, 680);
		canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
		canvas.css("background", "#ffe");
		$await(Jscex.Async.sleep(300));
		canvas.css("background", "none");
	}));
	var jumpAnimate = eval(Jscex.compile("async",
	function() {
		var ctx = tree.ctx;
		while (true) {
			tree.ctx.clearRect(0, 0, width, height);
			tree.jump();
			foot.draw();
			$await(Jscex.Async.sleep(25));
		}
	}));
	var textAnimate = eval(Jscex.compile("async",
	function() {
		var together = new Date();  //显示日期
		together.setFullYear(lover.info.year, (lover.info.month - 1), (lover.info.day));
		together.setHours(lover.info.hour); //小时
		together.setMinutes(lover.info.minute); //分钟
		together.setSeconds(lover.info.second); //秒钟
		together.setMilliseconds(0);
		$("#code").show().typewriter();
		$("#clock-box").fadeIn(500);
		while (true) {
			timeElapse(together);
			$await(Jscex.Async.sleep(1000));
		}
	}));
	var runAsync = eval(Jscex.compile("async",
	function() {
		$await(seedAnimate());
		$await(growAnimate());
		$await(flowAnimate());
		$await(moveAnimate());
		textAnimate().start();
		$await(jumpAnimate());
	}));
	runAsync().start();
})();