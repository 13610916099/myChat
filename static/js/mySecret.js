var mySecret = {
	JSON:function(sourceString,password){
		//console.log(this.de(sourceString,password));
		return eval("(" + this.de(sourceString,password) + ")");
	},
	en:function(sourceString,password){
		loading.show("正在加密数据…");
		console.log("1正在加密" + Date.now())
		password = this.getPassWord(password);
		sourceString = encodeURIComponent(sourceString);
		var rezult = "";
		var a1 = 0;
		var a2 = "";
		var a3 = "";
		var pi = 0 ;
		for(var i=0;i<sourceString.length;i++){
			pi = i % (password.length);
			a1 = sourceString.substring(i,i+1).charCodeAt();
			a1 = a1 + password[pi];
			if(a1>255){a1 -= 256;}
			a2 = "0" + a1.toString(16)
			a3 = a2.substring(a2.length-2,a2.length);
			rezult += a3;
		}
		loading.hide();
		console.log("1加密完成" + Date.now())
		return rezult;
	},
	de:function(sourceString,password){
		var patt=/^[0123456789abcdefABCDEF]*$/;
		if(!patt.test(sourceString)){return sourceString;}
		
		var cacheId = md5(sourceString);
		var cacheContent = myCache.get(cacheId);
		if(cacheContent != ""){return cacheContent;}
		
		loading.show("正在解密数据…");
		password = this.getPassWord(password);
		//console.log("password:" + password);
		var rezult = "";
		var a1 = 0;
		var a2 = "";
		var a3 = "";
		var pi = 0 ;
		for(var i=0;i<sourceString.length/2;i++){
			pi = i % (password.length);
			a1 = parseInt("0x" + sourceString.substring(i*2,(i+1)*2));
			a1 -= password[pi];
			if(a1<0){a1 += 256;}
			a2 = String.fromCharCode(a1);
			rezult += a2;
		}
		rezult = decodeURIComponent(rezult);
		
		myCache.set(cacheId,rezult);
		
		loading.hide();
		return rezult;
	},
	getPassWord:function(password){
		password = md5(password);
		var a = [];
		var a1 = ""
		for(var i=0;i<password.length;i++){
			a1 = password.substring(i,i+1);
			a.push(eval("0x" + a1));
		}
		return a;
	}
}