/**
 * 控制台主逻辑
 */

var currentLine;
var engine = new Engine();

/**
 * 建立初始行并设置键盘监听
 */
$(document).ready(function() {
			// 加载完所有js后回调的初始化函数
			var initFunc = function() {
				currentLine = Console.appendLineTo($("#console"));
				Console.setupKeyboardListener();
				Console.setupMouseListener();
				Console.setupTimer();
			};

			// 加载所有依赖的js脚本
			// loadBatchJs(initFunc, "js/console.util.js");

			// 由于已经在外部记载了，所以这里跳过加载直接启动
			initFunc();
		});

Console.setupMouseListener = function() {
	//主要是应对Chrome的右键监听
	$(document).bind('contextmenu', function(e) { 
		if( e.which == 3 )
			Console.showRightClick(e.pageX, e.pageY);
		return false;
	}); 

	//正常的鼠标监听
	$(document).click(function(e) {
				switch (e.which) {
					// 鼠标右键
					case 3 :
						Console.showRightClick(e.pageX, e.pageY);
						e.preventDefault();
						break;
					// 鼠标左键
					case 1 :
						Console.hideRightClick();
						e.preventDefault();
						break;
				}
			});

	//右键菜单的点击监听，点击到的a元素的href属性中包含操作码
	$("#rightClick").click(function(e) {
				var operation = $(e.target).attr("href");
				
				if( operation )
					engine.operate(operation);				
			});

};

/**
 * 设置键盘监听
 */
Console.setupKeyboardListener = function() {
	// 可显示字符部分
	$(document).keypress(function(e) {
				// 可显示字符直接接在当前行后面
				if (Console.isDisplayable(e.which)) {
					Console.write(String.fromCharCode(e.which), currentLine);
				}

			});

	$(document).keydown(function(e) {
				// $("#debug").append(e.keyCode);

				// 回车键则换行
				if (e.keyCode == 13) {
					Console.typeInCommand(currentLine);
					currentLine = Console.appendLineTo($("#console"));
				}

				// 删除键删除最后一个字符
				if (e.keyCode == 8) {
					Console.erase(String.fromCharCode(e.which), currentLine);
					e.preventDefault();
				}

				// 左方向键
				if (e.keyCode == 37) {
					Console.shiftCursor(false, currentLine);
				}
				// 右方向键
				if (e.keyCode == 39) {
					Console.shiftCursor(true, currentLine);
				}
			});
};


/**
 * 传入行对象，从中取出命令并交由引擎来执行
 */
Console.typeInCommand = function(line) {
	var command = Console.extractCommand(line);

	// 将命令传入引擎开始执行
	engine.act(command);
};

/**
 * 读取多个js进行加载
 * 
 * @param {}
 *            callBack 全部加载完成后的回调函数
 * @param callBack后面跟不限定个数的js路径即可
 */
Console.loadBatchJs = function(callBack) {
	var loader = {
		counter : arguments.length - 1,
		finish : function() {
			this.counter--;
			if (this.counter === 0) {
				callBack();
			}
		}
	};

	for (var i = 1; i < arguments.length; i++) {
		$.getScript(arguments[i], function() {
					loader.finish();
				});
	}
};

/**
 * 设置计时器，主要用于让光标周期性的闪烁
 */
Console.setupTimer = function() {
	// timer全局变量
	timer = {
		state : "cursorOn",
		start : function() {
			self.setTimeout("timer.switchState();", 800);
		},
		switchState : function() {
			// 只有在currentLine存在的时候才继续
			if (currentLine) {
				// 目前是光标点亮状态
				if (this.state == "cursorOn") {
					currentLine.children("p[id=cursor]")
							.removeClass("cursorOn");
					this.state = "cursorOff";

					self.setTimeout("timer.switchState()", 100);
				} else if (this.state == "cursorOff") {
					currentLine.children("p[id=cursor]").addClass("cursorOn");
					this.state = "cursorOn";

					self.setTimeout("timer.switchState()", 900);
				}
			}
		}
	};

	timer.start();
};

/**
 * 调试用的全局函数
 * 
 * @param {}
 *            msg
 */
function debug(msg) {
	$("#debug").append(msg);
}
