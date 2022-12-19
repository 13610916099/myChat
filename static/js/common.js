document.write(`<script src="/chat/static/js/mySecret.js?md"></script>`);
document.write(`<script src="/chat/static/js/cookie.js"></script>`);
document.write(`<script src="/chat/static/js/myWarn.js?asddfddf"></script>`);
document.write(`<script src="/chat/static/js/myDb.js?ddddd"></script>`);
document.write(`<script src="/chat/static/js/myRSA.js?asdf"></script>`);
document.write(`<script src="/chat/static/js/myRec.js?a2sdddf"></script>`);
document.write(`<script src="/chat/static/js/myImg.js?mddd"></script>`);
document.write(`<script src="/chat/static/js/recorder.js?asdf"></script>`);
document.write(`<script src="/chat/static/js/uploadFiles.js?as23ddf"></script>`);
document.write(`<script src="/chat/static/js/ecc.js?as23ddf"></script>`);
document.write(`<script src="/chat/static/js/myecc.js?dd"></script>`);
function subString2(strings){
	if(strings.length>4){return strings.substring(0,3) + "…"}else{return strings}
}
function date2(datet){
	datet = datet.replace(/-/g, "\/")
	var datet1 = new Date(datet);
	var dateString = (datet1.getMonth() + 1) + "月" + (datet1.getDate()) + "日" + (datet1.getHours()) + ":" + (datet1.getMinutes());
	return dateString;
	
}
function getSecondToNow(datet){//获取时间到现在的秒数
	console.log(datet);
	var timet = dateDateToNumber(datet);
	console.log(timet);
	var timeNow = Date.now();
	timeNow = parseInt(timeNow/1000) + 28800;
	console.log(timeNow);
	var timet2 = datet - timeNow;
	return timet2;
}
function dateDateToNumber(datet){//日期转为数字
	//consoleLog(datet);
	//var datet1 = datet.replace(/-/g,"/");
	return dateNumberToNumber(Date.parse(datet));		
}
function dateNumberToNumber(datet){//数字数字
	return parseInt(datet/1000) + 28800;	
}
function dateNumberToDate(datet){
	datet = (datet - 28800) * 1000;
	n=new Date(datet)
	return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8)
}
function dateDateToWord(datet){
	var timeT = dateNumberToNumber(Date.now()) - dateDateToNumber(datet);
	return dateTToWord(timeT);
}
function dateTToWord(datet){
	var timeString = "刚刚";
	if(datet>60){timeString = parseInt(datet / 60).toString() + "分钟前";}
	if(datet>3600){timeString = parseInt(datet / 3600).toString() + "小时前";}
	if(datet>86400){timeString = parseInt(datet / 86400).toString() + "天前";}
	if(datet>604800){timeString = parseInt(datet / 604800).toString() + "周前";}
	if(datet>2592000){timeString = parseInt(datet / 2592000).toString() + "月前";}
	if(datet>31536000){timeString = parseInt(datet / 31536000).toString() + "年前";}
	return timeString;
}
function dateNumberToWord(datet){
	var timeT = dateNumberToNumber(Date.now()) - datet;
	//return timeT.toString();
	return dateTToWord(timeT);
}
function getShortContent(cContent,cType,cLength){
			if(cType == 0){
				//cContent = mySecret.de(cContent,Cookie.get("PassName"));
			}
			if(cLength != undefined){
				if(cContent.length > cLength){
					cContent = cContent.substring(0,cLength) + "…";
				}
			}
			return cContent;
		}
var myJs = {
	rq:function(rqkey){
		url = window.location.href;
		console.log("url:" + url);
		var kv = decodeURIComponent((new RegExp('[?|&]' + rqkey + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
		if(kv == null){kv = "";}
		
		console.log("kv:" + kv);
		return kv;		
	},
	params:function(inObj){
		var result = "";
		if(inObj != undefined){
			for(var key in inObj){
				if(result == ""){
					result = key + "=" + inObj[key]
				}else{
					result += "&" + key + "=" + inObj[key]
				}
			}
		}
		return result;
	},
	getData:function(inputData){
		//https://cdn.staticfile.org/axios/0.18.0/axios.min.js
		var myJsDataInputData = {
			url:"/chat/api/api.asp",
			method:"post",
			data:"",
			callback:function(eData){}			
		}
		if(inputData.url != undefined){myJsDataInputData.url = inputData.url;}
		if(inputData.method != undefined){myJsDataInputData.method = inputData.method;}
		if(inputData.callback != undefined){myJsDataInputData.callback = inputData.callback;}
		if(inputData.data != undefined){myJsDataInputData.data = this.params(inputData.data);}
		//console.log(myJsDataInputData.data);
		loading.show();
		axios({
			method: myJsDataInputData.method,
			url: myJsDataInputData.url,
			data: myJsDataInputData.data
		}).then(function(data){
			loading.hide();
			var data1 = data.data;
			myJsDataInputData.callback(data1);
		});
	}
};




myTouch = {
	timeroutEvent:null,
	start(eventString,callback){
		var that = this;
		that.timeroutEvent = setTimeout(function(){
			that.longPress(eventString,callback);
		},500);
	},
	end(){
		this.clear();
	},
	move(){
		this.clear();
	},
	clear(){
		var that = this;
		clearTimeout(that.timeroutEvent);
		that.timeroutEvent = null;
	},
	longPress(eventS,callback){
		//alert("123");
		myJs.modal.show({
			content:"您确认要删除吗？",
			ok:{
				title:"确认删除",
				action:function(){
					myDb.del({
						tableName:"user",
						data:{
							user:eventS
						}
					});
					myDb.del({
						tableName:"chat",
						data:{
							user:eventS
						}
					});
					callback();
				}
			},
			cancel:{
				title:"取消",
				action:function(){}
			}
		});
	}
};