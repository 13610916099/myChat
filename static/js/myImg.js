var myImg = {
	imgSize2:137000,
	quality:0.5,
	cache:[],
	setCache:function(cacheId,cacheContent){
		this.cache.push({i:cacheId,c:cacheContent});
	},
	getCache:function(cacheId){
		var result = "";
		for(var i=0;i<this.cache.length;i++){
			if(this.cache[i].i == cacheId){
				result = this.cache[i].c;
				console.log("调用图片缓存,Key:" + this.cache[i].i);
			}			
		}
		return result;
	},
	imgToString:function(e,callBack){
		var that = this
		let file = e.target.files[0];
		if(file){
			this.photoCompress(file,function (base64Codes) { callBack(base64Codes);console.log(base64Codes);});
		}	
	},
	stringToImg:function(eString,callback){
		var imgObj = this.base64UrlToBlob(eString)
		callback(URL.createObjectURL(imgObj));
		var result = URL.createObjectURL(imgObj);
		return result;
	},
	photoCompress:function(file,callback){
		let that = this
		let ready = new FileReader()
		ready.readAsDataURL(file)
		ready.onload = function () {
			let re = this.result
			that.canvasDataURL(re,callback) // 开始压缩
			//console.log(re);
		}
	},
	canvasDataURL (path,callback) {
		let img = new Image()
		var that2 = this;
		img.src = path
		img.onload = function () {
			let that = this // 指到img
				// 默认按比例压缩
			let w = that.width,h = that.height,scale = w / h;
			var zzzwh = w * h;
			if(that2.imgSize2 > 0){zzzwh = that2.imgSize2;}
			var newImg = {width:Math.pow(zzzwh/scale,0.5)*scale,height:Math.pow(zzzwh/scale,0.5)};
			newImg.width = parseInt(newImg.width);
			newImg.height = parseInt(newImg.height);
			console.log(JSON.stringify(newImg));
			w = newImg.width
			h = newImg.height
			let quality = that.quality; // 默认图片质量为0.7quality值越小，所绘制出的图像越模糊
				// 生成canvas
			let canvas = document.createElement('canvas')
			let ctx = canvas.getContext('2d')
				// 创建属性节点
			let anw = document.createAttribute('width')
			anw.nodeValue = w
			let anh = document.createAttribute('height')
			anh.nodeValue = h
			canvas.setAttributeNode(anw)
			canvas.setAttributeNode(anh)
			ctx.drawImage(that, 0, 0, w, h);
			let base64 = canvas.toDataURL('image/jpeg', quality)
			callback(base64)
		}
	},
	    /* base64 转 Blob 格式 和file格式*/
	base64UrlToBlob (urlData) {
		//console.log(urlData)
		let arr = urlData.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
		//console.log(mime)
		while (n--) {u8arr[n] = bstr.charCodeAt(n);}
		let filename = Date.parse(new Date())  + '.jpg';
		return new File([u8arr], filename, {type: mime});
	},
	uploading:function(file,callback){
		var fileData = new FormData();
		fileData.append("file",file);
		var fileReader = new window.FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function(e){
			axios({
				method: 'POST',
				url: toUrl,
				data: fileData,
			}).then(function(data){
				console.log(data)
				toast.show("上传成功");
				ccallback();
			});
		}
	}
};