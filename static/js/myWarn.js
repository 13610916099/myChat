myWarn = {
	title:"提示",
	content:"提示信息",
	url:"/yinxingshu/chat/index.html?usertype=1",
	picUrl:"/yinxingshu/static/pic/logo.png",
	timer:null,
	init:function(){
		var loadingNode = document.createElement('div');
		loadingNode.id = "warnNoddle";//设置id，一个页面有且仅有一个toast
		document.body.appendChild(loadingNode);//添加到body下面
		loadingNode.setAttribute('class','flex lineCenter heightCenter')
		loadingNode.style = "width:100%;position:fixed;top:-60px;z-index:100000;"
			
		var intString = '<div onclick="location.href=\'' + this.url + '\';" class="flex flexRow heightCenter" style="background:#fff;width:90%;border:1px solid #999;min-height:60px;border-radius:10px;">' + 
			'<div class="flex lineCenter heightCenter divLeft2" style="width:60px;height:60px;" >' + 
				'<image src="/yinxingshu/static/pic/logo.png" width="48px" />' + 
			'</div>' + 
			'<div class="flex" style="padding-left:70px;padding-top:10px;padding-bottom:10px;padding-right:10px;">' + 
				'<div class="flex "><b>' + this.title + '</b></div>' + 
				'<div>' + this.content + '</div>' + 
			'</div></div>'			
		loadingNode.innerHTML = intString ;
	},
	show:function(loadingTitle){
		if(loadingTitle != undefined){
		if(loadingTitle.title == undefined){
			this.title = "提示";
		}else{
			this.title = loadingTitle.title;
		}
		if(loadingTitle.content == undefined){
			this.content = "提示信息";
		}else{
			this.content = loadingTitle.content;
		}
		if(loadingTitle.picUrl == undefined){
			this.picUrl = "/yinxingshu/static/pic/logo.png";
		}else{
			this.picUrl = loadingTitle.picUrl;
		}
		if(loadingTitle.url == undefined){
			this.url = "/yinxingshu/chat/index.html?usertype=1";
		}else{
			this.url = loadingTitle.url;
		}
		}
		
			
		this.move();
		this.showing()
	},
	showing(){
		this.init();
		var divLoadNode = document.getElementById("warnNoddle");
		var zTop = -60;
		var that = this;
		clearInterval(this.timer);
		this.timer = null;
		that.timer = setInterval(function(){
			zTop += 10;
			if(zTop >=0){
				zTop = 0;
				clearInterval(that.timer);
				that.timer = null;
				setTimeout(function(){that.hide();},3000);
			}
			divLoadNode.style.top = zTop + "px";
		}, 50);
	},
	move(){
		var divLoadNode = document.getElementById("warnNoddle");
		if(divLoadNode != null){divLoadNode.remove();}
		clearInterval(this.timer);
		this.timer = null;
	},
	hide(){
		var divLoadNode = document.getElementById("warnNoddle");
		if(divLoadNode == null){return;}
		var zTop = 0;
		var that = this;
		clearInterval(this.timer);
		this.timer = null;
		that.timer = setInterval(function(){
			zTop -= 10;
			if(zTop < -60){
				that.move();
				clearInterval(that.timer);
				that.timer = null;
				return;
			}
			divLoadNode.style.top = zTop + "px";
		}, 50);
	}
};
var modal = {//{title:'',content:'',ok:{title:'',action:function(){}},cancel:{title:'',action:function(){}}}
		title:"提示",
		content:"提示信息",
		ok:{title:"确定",action:function(){}},
		cancel:{title:"取消",action:function(){}},
		init:function(){
			let contentStyle = document.createElement("style");
			document.head.appendChild(contentStyle);
			contentStyle.innerHTML = '.divLoadingNode{display:flex;flex-direction:row;justify-content:center;' + 
			'align-items:center;width:100%;height:100vh;position: fixed;left:0;top:0;z-index:99999;background:rgba(0,0,0,0.5);}' + 
			'.divLoadingNode2{display:flex;flex-direction:row;justify-content:center;align-items:center;background:#fff;padding: 8px 8px;border:1px solid #666;}';
			
			var loadingNode = document.createElement('div');
			loadingNode.id = "divModalNode";//设置id，一个页面有且仅有一个toast
			document.body.appendChild(loadingNode);//添加到body下面
			loadingNode.setAttribute('class','divLoadingNode')
			
			var intString = '<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:80%;border:1px solid #f63;background:#fff;box-sizing:border-box;">' + 
				'<div style="display:flex;flex-direction:row;justify-content:center;align-items:center;background:#f00;width:100%;height:48px;color:#fff;font-weight:bold;box-sizing:border-box;">' + this.title + '</div>' +
				'<div style="padding:10px;text-align:left;width:100%;box-sizing:border-box;">' + this.content + '</div>' + 
				'<div style="display:flex;flex-direction:row;justify-content:center;align-items:center;width:100%;font-weight:bold;">' +
					'<span onclick="modal.ok.action();modal.hide();" style="padding:6px 12px;background:#f00;margin:4px;color:#fff;border-radius:6px;" >' + this.ok.title + '</span>';
			if(this.cancel != undefined){
				intString += '<span onclick="modal.cancel.action();modal.hide();" style="padding:4px 12px;background:#f00;margin:6px;color:#fff;border-radius:6px;" >' + this.cancel.title + '</span>';
			}
				intString += '</div>' + 
			'</div>';
			
			loadingNode.innerHTML = intString ;
		},
		show:function(loadingTitle){
			if(loadingTitle.title == undefined){
				this.title = "提示";
			}else{
				this.title = loadingTitle.title;
			}
			
			this.content = loadingTitle.content;
			
			if(loadingTitle.ok == undefined){
				this.ok = {title:"确定",action:function(){}};
			}else{
				this.ok = loadingTitle.ok;
			}
			this.cancel = loadingTitle.cancel;
			
			this.hide();
			this.init()
		},
		hide:function(){
			var divLoadNode = document.getElementById("divModalNode");
			if(divLoadNode != null){divLoadNode.remove();}
		}
	};
var loading = {
		title:"加载中……",
		init:function(){
			let contentStyle = document.createElement("style");
			document.head.appendChild(contentStyle);
			contentStyle.innerHTML = '.divLoadingNode{display:flex;flex-direction:row;justify-content:center;' + 
			'align-items:center;width:100%;height:100vh;position: fixed;left:0;top:0;z-index:99999;background:rgba(0,0,0,0.5);}' + 
			'.divLoadingNode2{display:flex;flex-direction:row;justify-content:center;align-items:center;background:#fff;padding: 8px 8px;border:1px solid #666;}';
			var loadingNode = document.createElement('div');
			loadingNode.id = "divLoadingNode";//设置id，一个页面有且仅有一个toast
			document.body.appendChild(loadingNode);//添加到body下面
			loadingNode.setAttribute('class','divLoadingNode')
			var textNode = document.createElement('div');
			loadingNode.appendChild(textNode);  
			textNode.innerHTML = '<image src="/yinxingshu/static/pic/loading.gif" width="32px"/><span style="margin-left:10px;">' + this.title + '</span>';
			textNode.setAttribute('class','divLoadingNode2'); 
		},
		show:function(loadingTitle){
			this.hide();
			if(loadingTitle != undefined){this.title = loadingTitle;}else{this.title = "加载中……"}
			this.init();
		},
		hide:function(){
			var divLoadNode = document.getElementById("divLoadingNode");
			if(divLoadNode != null){divLoadNode.remove();}
		}
	};
var toast = {
		title:"提示信息",
		init:function(){
			let contentStyle = document.createElement("style");
			document.head.appendChild(contentStyle);
			contentStyle.innerHTML = '.divLoadingNode{display:flex;flex-direction:row;justify-content:center;' + 
			'align-items:center;width:100%;height:100vh;position: fixed;left:0;top:0;z-index:999999;background:rgba(0,0,0,0.5);}' + 
			'.divLoadingNode2{display:flex;flex-direction:row;justify-content:center;align-items:center;background:#fff;padding: 8px 8px;border:1px solid #666;}';
			var loadingNode = document.createElement('div');
			loadingNode.id = "divToastNode";//设置id，一个页面有且仅有一个toast
			document.body.appendChild(loadingNode);//添加到body下面
			loadingNode.setAttribute('class','divLoadingNode')
			var textNode = document.createElement('div');
			loadingNode.appendChild(textNode);  
			textNode.innerHTML = this.title;
			textNode.setAttribute('class','divLoadingNode2');
		},
		show:function(loadingTitle){
			var that = this;
			this.hide();
			if(loadingTitle != undefined){this.title = loadingTitle;}else{this.title = "提示信息"}
			this.init()
			setTimeout(function(){that.hide()},2000); 
		},
		hide:function(){
			var divLoadNode = document.getElementById("divToastNode");
			if(divLoadNode != null){divLoadNode.remove();}
		}
	}