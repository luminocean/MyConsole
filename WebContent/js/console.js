/**
 * 控制台主逻辑
 */
 
 
var currentLine;
/**
 * 建立初始行并设置键盘监听
 */
$(document).ready(function() {
			// 加载完所有js后回调的初始化函数
			var initFunc = function() {
				currentLine = appendLineTo($("#console"));
				setupKeyboardListener();
				//setupTimer();
			};

			// 加载所有依赖的js脚本
			//loadBatchJs(initFunc, "js/console.util.js");
			
			//由于已经在外部记载了，所以这里跳过加载直接启动
			initFunc();
		});


/**
 * 设置键盘监听
 */
function setupKeyboardListener() {
	$(document).keypress(function(e) {
				// $("#debug").append(e.keyCode);

				// 可显示字符直接接在当前行后面
				if (isDisplayable(e.which)) {
					write(String.fromCharCode(e.which), currentLine);
				}
				// 回车键则换行
				if (e.which == 13) {
					typeInCommand(currentLine);
					currentLine = appendLineTo($("#console"));
				}
				// 删除键删除最后一个字符
				if (e.which == 8) {
					erase(String.fromCharCode(e.which), currentLine);
				}
				// 左方向键
				if (e.keyCode == 37) {
					shiftCursor(false, currentLine);
				}
				// 右方向键
				if (e.keyCode == 39) {
					shiftCursor(true, currentLine);
				}
			});
}


function typeInCommand(line){
	var command = extractCommand(line);	
	
	//将命令传入引擎开始执行
	engine.act(command);
}

/**
 * 读取多个js进行加载
 * 
 * @param {}
 *            callBack 全部加载完成后的回调函数
 * @param callBack后面跟不限定个数的js路径即可
 */
function loadBatchJs(callBack) {
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
}

/**
 * 设置计时器，主要用于让光标周期性的闪烁
 */
function setupTimer() {
	//timer全局变量
	timer = {
		state : "cursorOn",
		start : function() {
			self.setTimeout("timer.switchState();", 800);
		},
		switchState : function() {
			//只有在currentLine存在的时候才继续
			if (currentLine) {
				//目前是光标点亮状态
				if (this.state == "cursorOn") {
					currentLine.children("p[id=cursor]")
							.removeClass("cursorOn");
					this.state = "cursorOff";
					
					self.setTimeout("timer.switchState()", 200);
				}else if(this.state == "cursorOff" ){
					currentLine.children("p[id=cursor]")
							.addClass("cursorOn");
					this.state = "cursorOn";
					
					self.setTimeout("timer.switchState()", 800);
				}
			}
		}
	};
	
	timer.start();
}
