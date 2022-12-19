var myRec = {
	rec:null,
	isRec:false,
	startRec:function(){
		var that = this;
		this.rec = Recorder();
		this.rec.open(
			function(){that.rec.start();that.isRec = true;},
			function(msg,isUserNotAllow){alert((isUserNotAllow?"用户拒绝了权限，":"")+"无法录音:"+msg);}
		);
	},
	stopRec:function(callback){
		var that = this;
		this.rec.stop(
			function(blob,duration){
				let ready = new FileReader()
					/* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
				ready.readAsDataURL(blob)
				ready.onload = function () {
					console.log(this.result);
					if(callback != undefined){callback(this.result,duration);}
					console.log(blob.duration)
					console.log(duration)
					that.isRec = false;
				}
			},
			function(msg){
				alert("录音失败:"+msg);
			}
		);
		//this.rec.close();
	},
	playString:function(soundString,callback){
		var imgObj = this.base64UrlToBlob(soundString)
		callback(URL.createObjectURL(imgObj));
	},
	base64UrlToBlob (urlData) {
		let arr = urlData.split(','),mime = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]),n = bstr.length,u8arr = new Uint8Array(n)
		while (n--) {u8arr[n] = bstr.charCodeAt(n);}
		let filename = Date.parse(new Date())  + '.mp3';
		return new File([u8arr], filename, {type: "audio/mp3"});
	},
};