/**
 * 控制台命令的解析与执行引擎
 */
 
 //全局的引擎，可以被其他模块调用
 var engine = new Object();
 
 engine.act = function(command){
 	alert("In engine: " + command);
 };