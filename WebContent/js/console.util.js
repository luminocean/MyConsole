/**
 * 控制台的工具方法
 */

//Console相关方法的命名空间
var Console = {};


/**
 * 显示右键菜单
 * @param {} pageX
 * @param {} pageY
 */
Console.showRightClick = function(pageX, pageY){
	//显示前先隐藏起来（为了能够连续的点击右键都显示需要的效果）
	$("#rightClick").hide();
	
	$("#rightClick").css("left", pageX);
	$("#rightClick").css("top", pageY);
	
	//debug("("+pageX+","+pageY+")");
	
	$("#rightClick").show(180);
};


/**
 * 隐藏右键菜单
 * @param {} pageX
 * @param {} pageY
 */
Console.hideRightClick = function(){
	$("#rightClick").hide();
};

/**
 * 平移光标
 * false为左， true为右
 * @param  direction
 * @param  target
 */
Console.shiftCursor = function(direction, target) {
	text1 = target.children(":eq(1)");
	cursor = target.children(":eq(2)");
	text2 = target.children(":eq(3)");

	if (!direction) {
		content1 = text1.text();

		// 如果第一个节点元素还有东西的话
		if (content1.length > 0) {
			// 获取text1中最后一个字符
			lastChar = content1.charAt(content1.length - 1);
			// text1去尾
			content1 = content1.substring(0, content1.length - 1);
			text1.text(content1);

			// 在设置cursor以前，如果cursor里面由东西则避难到text2里面去
			cc = cursor.text();
			if (cursor.text() != " ") {
				text2.prepend(cursor.text());
			}
			// 填充cursor
			cursor.text(lastChar);
		}
	} else {
		content2 = text2.text();

		if (content2.length > 0) {
			// 获取text2中第一个字符
			firstChar = content2.charAt(0);
			// text2去头
			content2 = content2.substring(1, content2.length);
			text2.text(content2);

			// 在设置cursor以前，如果cursor里面由东西则避难到text1里面去
			if (cursor.text() != "&nbsp") {
				text1.append(cursor.text());
			}
			// 填充cursor
			cursor.text(firstChar);
		}
		// 如果右边没有内容了再往右就显示出空的光标
		else if (content2.length == 0 && cursor.text() != " ") {
			text1.append(cursor.text());

			cursor.text(" ");
		}
	}

};

/**
 * 向目标行写入字符
 * 由于写入字符只可能写在光标前面
 * 所以就处理成行的第一个元素（即文本前半部）的最后加上一个字符
 * @param {} c
 * @param {} target
 */
Console.write = function(c, target) {
	// 第一个text元素
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	text1.append(c);
};

/**
 * write的逆向操作
 * @param {} c
 * @param {} target
 */
Console.erase = function(c, target) {
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	content = text1.text();
	content = content.substring(0, content.length - 1);
	text1.text(content);
};

/**
 * 判断字符是否可以显示
 * @param {} code
 * @return {Boolean}
 */
Console.isDisplayable = function(code) {
	if (code >= 32 && code <= 126)
		return true;
};

/**
 * 为指定目标添加一个新行
 * @param target 添加行的目标
 * @return 添加的新行本身
 */
Console.appendLineTo = function(target) {
	//如果已经存在一个当前行了（除非是加的第一行，否则基本上是一直在的）
	//就把当前行里面光标点亮的标记去掉（因为要加到下一行上）
	if (currentLine)
		currentLine.children("p[id=cursor]").removeClass("cursorOn");
		
	// 创建div元素，它是一个commandLine
	newLine = $("<div></div>");
	newLine.addClass("commandLine");

	// 嵌入显示的用户名
	userName = $("<p></p>");
	userName.text("user $ ");
	userName.addClass("lineText");
	userName.addClass("userName");
	newLine.append(userName);

	// 嵌入（空的）文本节点（前半部分
	text = $("<p></p>");
	text.text("");
	text.addClass("lineText");
	newLine.append(text);

	// 嵌入光标
	cursor = $("<p>&nbsp;</p>");
	cursor.attr("id", "cursor");
	cursor.addClass("lineText");
	cursor.addClass("cursorOn");
	newLine.append(cursor);

	// 嵌入（空的）文本节点（后半部分
	text = $("<p></p>");
	text.text("");
	text.addClass("lineText");
	newLine.append(text);

	newLine.appendTo(target);
	return newLine;
};


/**
 * 从传入的行对象中读取里面的文本内容
 * @param {} line
 */
Console.extractCommand = function(line){
	var command = "";
	
	line.children(".lineText").each(function(k, v){
		content = $(v).text();
		
		//筛去第一个（用户名部分），空格部分以及空白部分
		if( k!=0 && !new RegExp("\\s").test(content) && content != "" )
			command += content;
	});
	
	return command;
};

/**
 * 冻结屏幕阻止用户操作的方法
 */
Console.frozeScreen = function(){
	$("#frozenLayer").remove();
	
	frozenLayer = $("<div></div>");
	frozenLayer.attr("id", "frozenLayer");
	frozenLayer.css("position", "fixed");
	frozenLayer.css("left", 0);
	frozenLayer.css("top", 0);
	frozenLayer.css("height", $(window).height());
	frozenLayer.css("width", $(window).width());
	frozenLayer.css("z-index", 1);
	frozenLayer.css("background-color", "rgba(0,0,0,0.5)");
	
	$("body").prepend(frozenLayer);
};

/**
 * 解除冻结效果
 */
Console.defrozeScreen = function(){
	$("#frozenLayer").remove();
};