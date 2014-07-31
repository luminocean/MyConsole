/**
 * 控制台的工具方法
 */


/**
 * 平移光标
 * false为左， true为右
 * @param  direction
 * @param  target
 */
function shiftCursor(direction, target) {
	text1 = target.children(":eq(1)");
	cursor = target.children(":eq(2)");
	text2 = target.children(":eq(3)");

	if (!direction) {
		content1 = text1.html();

		// 如果第一个节点元素还有东西的话
		if (content1.length > 0) {
			// 获取text1中最后一个字符
			lastChar = content1.charAt(content1.length - 1);
			// text1去尾
			content1 = content1.substring(0, content1.length - 1);
			text1.html(content1);

			// 在设置cursor以前，如果cursor里面由东西则避难到text2里面去
			cc = cursor.html();
			if (cursor.html() != "&nbsp;") {
				text2.prepend(cursor.html());
			}
			// 填充cursor
			cursor.html(lastChar);
		}
	} else {
		content2 = text2.html();

		if (content2.length > 0) {
			// 获取text2中第一个字符
			firstChar = content2.charAt(0);
			// text2去头
			content2 = content2.substring(1, content2.length);
			text2.html(content2);

			// 在设置cursor以前，如果cursor里面由东西则避难到text1里面去
			if (cursor.html() != "&nbsp") {
				text1.append(cursor.html());
			}
			// 填充cursor
			cursor.html(firstChar);
		}
		// 如果右边没有内容了再往右就显示出空的光标
		else if (content2.length == 0 && cursor.html() != "&nbsp;") {
			text1.append(cursor.html());

			cursor.html("&nbsp;");
		}
	}

}

/**
 * 向目标行写入字符
 * 由于写入字符只可能写在光标前面
 * 所以就处理成行的第一个元素（即文本前半部）的最后加上一个字符
 * @param {} c
 * @param {} target
 */
function write(c, target) {
	// 第一个text元素
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	text1.append(c);
}

/**
 * write的逆向操作
 * @param {} c
 * @param {} target
 */
function erase(c, target) {
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	content = text1.html();
	content = content.substring(0, content.length - 1);
	text1.html(content);
}

/**
 * 判断字符是否可以显示
 * @param {} code
 * @return {Boolean}
 */
function isDisplayable(code) {
	if (code >= 32 && code <= 126)
		return true;
}

/**
 * 为指定目标添加一个新行
 * @param target 添加行的目标
 * @return 添加的新行本身
 */
function appendLineTo(target) {
	//如果已经存在一个当前行了（除非是加的第一行，否则基本上是一直在的）
	//就把当前行里面光标点亮的标记去掉（因为要加到下一行上）
	if (currentLine)
		currentLine.children("p[id=cursor]").removeClass("cursorOn");
		
	// 创建div元素，它是一个commandLine
	newLine = $("<div></div>");
	newLine.addClass("commandLine");

	// 嵌入显示的用户名
	userName = $("<p></p>");
	userName.html("user $ ");
	userName.addClass("lineText");
	userName.addClass("userName");
	newLine.append(userName);

	// 嵌入（空的）文本节点（前半部分
	text = $("<p></p>");
	text.html("");
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
	text.html("");
	text.addClass("lineText");
	newLine.append(text);

	newLine.appendTo(target);
	return newLine;
}