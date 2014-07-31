/**
 * 控制台命令的解析与执行引擎
 */
 
 //全局的引擎构造方法，可以被其他模块调用
 //同时它也作为引擎相关函数的一个命名空间使用
 var Engine = function(){};
 
 
 /**
  * engine的执行方法，由console主逻辑来调用
  * @param {} command
  * 
  * 使用Engine的原型这样Engine的所有实例都会拥有这个方法
  * 直接Engine.act只会让这个构造函数多了一个方法，构造出的对象并不会
  */
 Engine.prototype.act = function(command){
 	action = Engine.resolveCommand(command);
 	
 	//执行命令
 	if( typeof action == "function" ){
 		action();
 	}
 };
 
 
 /**
  * 解析用户输入的命令，返回一个可以执行的函数
  * @param {} command
  */
 Engine.resolveCommand = function (command){
 	switch(command){
 		case "clear":
 			return Engine.clear;
 	}
 };
 
 /**
  * 清空屏幕的方法
  * 对应shell命令clear
  */
 Engine.clear = function(){
 	$("#console").children().remove();
 };