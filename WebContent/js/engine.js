/**
 * 控制台命令的解析与执行引擎
 */

// 全局的引擎构造方法，可以被其他模块调用
// 同时它也作为引擎相关函数的一个命名空间使用
var Engine = function() {};

//引擎本地方法的命名空间，用于存放一些本地的代码实现
Engine.native = {};

/**
 * engine的执行方法，由console主逻辑来调用
 * 
 * @param {} command 传送过来的命令，等同于shell命令
 * 
 * 使用Engine的原型这样Engine的所有实例都会拥有这个方法 直接Engine.act只会让这个构造函数多了一个方法，构造出的对象并不会
 */
Engine.prototype.act = function(command) {
	//解析命令，最终得到可执行的函数
	action = Engine.resolveCommand(command);

	// 执行命令
	if (typeof action == "function") {
		action();
	}
};

/**
 * 接受操作码，执行本地命令（即无需服务器的操作）
 * 
 * @param {} operation 操作码，这玩意儿一定是本地的
 * 
 * 具体来说，一条command由Engine解析，如果需要服务器则会从服务器获取数据并显示到前段去
 * 如果是本地的方法（比如清屏），那就会被转换成operation交由本地native方法处理后直接返回（如果有的话）
 */
Engine.prototype.operate = function(operation) {
	switch (operation) {
		//清屏操作
		case "clear":
			//本地的清屏方法，别忘了最后加上一行，因为没有回车
			Engine.native.clear();
			currentLine = Console.appendLineTo($("#console"));
			break;
		//关于操作
		case "about":
			Engine.native.showModal("HAVE A NICE DAY ^_^");
			break;
	}
};

/**
 * 解析用户输入的命令，返回一个可以执行的函数
 * 
 * @param {}
 *            command
 */
Engine.resolveCommand = function(command) {
	switch (command) {
		case "clear" :
			return Engine.native.clear;
	}
};

/**
 * 清空屏幕的方法 对应shell命令clear
 */
Engine.native.clear = function() {
	$("#console").children().remove();
};


Engine.native.showModal = function(content){
	Console.frozeScreen();
	
	var modal = $("#modal").text(content);
	//获取并设定模态框大小（虽然看起来很奇怪，放置遇到边缘的时候被挤压换行
	var width = modal.width();
	var height = modal.height();
	modal.css("width", width);
	modal.css("height", height);
	
	//设定初始位置，高度设定为在窗口上面一点（这样就看不见了）
	var initX = ($(document).width()-width)/2;
	var initY = -height;
	var destX = initX; //X坐标不用变
	var destY = ($(document).height()-height)/2;
	modal.css("left", initX);
	modal.css("top", initY);
	
	//显示出现模态框
	modal.show();
	modal.animate({left: destX+"px", top:destY+"px"}, 3000);
	
	//时间到就调用的函数，把模态框再移回去
	var callback = function(){
		modal.animate({left: initX+"px", top:initY+"px"}, 500,
				function(){Console.defrozeScreen();}
		);
	};
	self.setTimeout(callback, 3000);
};