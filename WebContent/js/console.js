// 当前行
var currentLine;

// 建立初始行并设置键盘监听
$(document).ready(function() {
			currentLine = appendLineTo($("#console"));
			setupKeyboardListener();
		});

// 设置键盘监听
function setupKeyboardListener() {
	$(document).keypress(function(e) {
				// $("#debug").append(e.keyCode);

				// 可显示字符直接接在当前行后面
				if (isDisplayable(e.which)) {
					write(String.fromCharCode(e.which), currentLine);
				}

				// 回车键则换行
				if (e.which == 13) {
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

				// 左方向键
				if (e.keyCode == 39) {
					shiftCursor(true, currentLine);
				}
			});
}

// false为左， true为右
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

function write(c, target) {
	// 第一个text元素
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	text1.append(c);
}

function erase(c, target) {
	text1 = target.children(":eq(1)"); // 等于 target.children().eq(1)

	content = text1.html();
	content = content.substring(0, content.length - 1);
	text1.html(content);
}

// 判断是否可以显示
function isDisplayable(code) {
	if (code >= 32 && code <= 126)
		return true;
	// 函数的默认返回为null
}

/**
 * 为指定目标添加一个新行
 * @param target 添加行的目标
 * @return 添加的新行本身
 */
function appendLineTo(target) {
	//如果已经存在一个当前行了（除非是加的第一行，否则基本上是一直在的）
	//就把当前行里面的光标标记去掉（因为要加到下一行上）
	if (currentLine)
		currentLine.children("p[id=cursor]").removeAttr("id");
		
	// 创建div元素，它是一个commandLine
	newLine = $("<div></div>");
	newLine.attr("class", "commandLine");

	// 嵌入显示的用户名
	userName = $("<p></p>");
	userName.html("user $ ");
	userName.attr("class", "lineText userName");
	newLine.append(userName);

	// 嵌入（空的）文本节点（前半部分
	text = $("<p></p>");
	text.html("");
	text.attr("class", "lineText");
	newLine.append(text);

	// 嵌入光标
	cursor = $("<p>&nbsp;</p>");
	cursor.attr("id", "cursor");
	cursor.attr("class", "lineText");
	newLine.append(cursor);

	// 嵌入（空的）文本节点（后半部分
	text = $("<p></p>");
	text.html("");
	text.attr("class", "lineText");
	newLine.append(text);

	newLine.appendTo(target);
	return newLine;
}
