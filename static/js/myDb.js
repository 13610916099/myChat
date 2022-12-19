
/*
作者：沉默的海，815720949@qq.com 
1、数据存储在localstorage ，根据浏览器要求，最大存5M。超出将自动清理，删除时间最早的2.5M。
2、表字段创建后不可修改，如须修改，需删除重建。
3、建表：myDb.createTable({
	tableName:"表名",
	keys:[
		{
			type:1 //0为字符串，1为数字，包括所有数字类型,2 int 自增长,字段名必须为id 方可生效
			name:"id",
		},
		{
			name:"userName",
			type:0 //0为字符串，1为数字，包括所有数字类型
		}
	]
});
4、删除表：myDb.dropTable("表名");
5、判断表是否存在：myDb.checkTable("表名");返回true/false
插入数据：myDb.Insert({
	tableName:"表名",
	data:{
		id:12,
		userName:"abcdef"
	}
})
删除数据：myDb.del({
	tableName:"表名",
	data:{//删除条件，可多条件，无条件时表将被清空。
		id:12,
		userName:"abcdef"
	}
});
查询：myDb.search({
	tableName:"表名",
	data:{//查询条件，可多条件，无条件时返回所有记录。
		id:12,
		userName:"abcdef"
	}
});
更新：myDb.update({
	tableName:"表名",
	data:{//查询条件，可多条件，无条件时更新所有记录。
		id:12
	},
	newData:{//新数据。
		userName:"123456"
	}
});


*/
var myDb = {
	DbKey:"myDb_string",
	createTable(tableData){
		if(this.checkTable(tableData.tableName)){console.log("创建表失败，表名重复。" + tableData.tableName);return;}
		var dataString = this.getStorage(this.DbKey);
		if(dataString != ""){ dataString += ";"; }
		dataString +=  tableData.tableName + ":";
		for(var i=0;i<tableData.keys.length;i++){
			if(i==0){
				dataString += tableData.keys[i].name + "|" + tableData.keys[i].type;
			}else{
				dataString += "," + tableData.keys[i].name + "|" + tableData.keys[i].type;
			}
		}
		this.setTableContentString(dataString);
	},
	dropTable(tableName){
		if(!this.checkTable(tableName)){console.log("表不存在。");return;}
		var dataString = this.getStorage(this.DbKey);
		var dataA = dataString.split(";");
		var dataA2;
		var dataString2 = ""
		for(var i=0;i<dataA.length;i++){
			dataA2 = dataA[i].split(":");
			if(dataA2[0].toUpperCase() != tableName.toUpperCase()){
				if(dataString2 == ""){
					dataString2 += dataA[i];
				}else{
					dataString2 += ";" + dataA[i];
				}
			}
		}
		this.setTableContentString(dataString2);
	},
	checkTable(tableName){
		var dataString = this.getStorage(this.DbKey);
		if(dataString == ""||dataString == null){return false;}
		//console.log(dataString)
		var dataA = dataString.split(";");
		var dataA2;
		for(var i=0;i<dataA.length;i++){
			dataA2 = dataA[i].split(":");
			if(dataA2[0].toUpperCase() == tableName.toUpperCase()){return true;}
		}
		return false;
	},
	insert(tableData){
		if(tableData.tableName == undefined){console.log("找不到对应的表");return;}
		if(!this.checkTable(tableData.tableName)){console.log("找不到对应的表");return;}
		tableKeys = this.getTableKeys(tableData.tableName);
		var dataString = "";
		for(var i=0;i<tableKeys.length;i++){
			var dataString2 = tableData.data[tableKeys[i].name];
			if(dataString2 == undefined){
				if(tableKeys[i].type == 0){
					dataString2 = "";
				}else{
					if(tableKeys[i].type == 2){
						dataString2 = this.getNewId(tableData.tableName);
					}else{
						dataString2 = "0";
					}
				}
			}else{
				if(tableKeys[i].type == 0){
					dataString2 = escape(dataString2);
				}
			}
			if(i==0){dataString += dataString2;}else{dataString += "," + dataString2;}
		}
		var dataString3 = this.getTableContentString(tableData.tableName);
		if(dataString3 == ""){
			dataString3 += dataString;
		}else{dataString3 += ";" + dataString;}
		this.setTableContentString(dataString3,tableData.tableName);
	},	
	del(tableData){
		var key = this.getKeyIndex2(tableData);
		var dataString = this.getTableContentString(tableData.tableName);
		if(dataString == ""){console.log("找不到数据");return ;}
		var dataString2 = "";
		var dataA = dataString.split(";");
		for(var i=0;i<dataA.length;i++){
			var dataA2 = dataA[i].split(",");
			var isFind = true;
			if(key != undefined){
				for(var j=0;j<key.length;j++){
					if(dataA2[key[j].index].toUpperCase() != key[j].val.toUpperCase()){
						isFind = false;
					}
				}
			}
			if(isFind){}else{
				if(dataString2 == ""){dataString2 += dataA[i];}else{dataString2 += ";" + dataA[i];}
			}
		}
		this.setTableContentString(dataString2,tableData.tableName);
	},
	update(tableData){
		var key = this.getKeyIndex2(tableData);
		var tableKeys = this.getTableKeys(tableData.tableName);
		var dataString = this.getTableContentString(tableData.tableName);
		if(dataString == ""){console.log("找不到数据");return ;}
		var dataString2 = "";
		var dataA = dataString.split(";");
		for(var i=0;i<dataA.length;i++){
			var dataA2 = dataA[i].split(",");
			
			var isFind = true;
			if(key != undefined){
				for(var j=0;j<key.length;j++){
					if(dataA2[key[j].index].toUpperCase() != key[j].val.toUpperCase()){
						isFind = false;
					}
				}
			}
			
			if(isFind){
				var dataString3 = "";
				for(var j=0;j<tableKeys.length;j++){
					if(tableData.newData[tableKeys[j].name] == undefined){
						if(j==0){dataString3 += dataA2[j];}else{dataString3 += "," + dataA2[j];}
					}else{
						var dataString4 = tableData.newData[tableKeys[j].name];
						if(tableKeys[j].type==0){dataString4 = escape(dataString4);}else{dataString4 = dataString4.toString();}
						if(j==0){dataString3 += dataString4;}else{dataString3 += "," + dataString4;}
					}
				}
				if(dataString2 == ""){dataString2 += dataString3;}else{dataString2 += ";" + dataString3;}
			}else{
				if(dataString2 == ""){dataString2 += dataA[i];}else{dataString2 += ";" + dataA[i];}
			}
		}
		this.setTableContentString(dataString2,tableData.tableName);
	},
	search(tableData){
		var key = this.getKeyIndex2(tableData);
		var tableKeys = this.getTableKeys(tableData.tableName);
		var dataString = this.getTableContentString(tableData.tableName);
		if(dataString == ""){console.log("找不到数据");return  undefined;}
		var dataString2 = "";
		var rezult = [];
		var dataA = dataString.split(";");
		for(var i=0;i<dataA.length;i++){
			var dataA2 = dataA[i].split(",");
			
			var isFind = true;
			if(key != undefined){
				for(var j=0;j<key.length;j++){
					if(dataA2[key[j].index].toUpperCase() != key[j].val.toUpperCase()){
						isFind = false;
					}
				}
			}
			if(isFind){
				rezult.push(this.stringToObj(tableKeys,dataA[i]));
			}
		}
		if(rezult.length<1){rezult = undefined;}
		return rezult;
	},
	getNewId(tableName){
		var tableA = myDb.search({tableName:tableName,data:{}});
		var newId = 1;
		if(tableA != undefined){newId = tableA[tableA.length - 1].id + 1;}
		return newId; 
	},
	stringToObj(keys,val){
		var valA = val.split(",");
		var rezult = {};
		var dataString = "";
		for(var i=0;i<keys.length;i++){
			dataString = valA[i];
			if(keys[i].type == 0){dataString = unescape(dataString);}else{dataString = Number(dataString);}
			rezult[keys[i].name] = dataString;
		}		
		return rezult;
	},
	getKeyIndex(tableData){
		if(tableData.tableName == undefined){console.log("找不到对应的表");return undefined;}
		if(!this.checkTable(tableData.tableName)){console.log("找不到对应的表");return undefined;}
		if(tableData.data == undefined){console.log("无条件查询");return undefined;}
		var key = {index:-1,type:0,val:""};
		tableKeys = this.getTableKeys(tableData.tableName);
		for(var i=0;i<tableKeys.length;i++){
			if(tableData.data[tableKeys[i].name] != undefined){
				key.index = i;
				key.type = tableKeys[i].type;
				key.val = tableData.data[tableKeys[i].name];
			}
		}
		if(key.index == -1){console.log("不存在的字段");return undefined;}
		if(key.type == 0){key.val = escape(key.val);}else{key.val = key.val.toString();}
		return key;
	},
	getKeyIndex2(tableData){
		if(tableData.tableName == undefined){console.log("找不到对应的表:" + tableData.tableName);return undefined;}
		if(!this.checkTable(tableData.tableName)){console.log("找不到对应的表:" + tableData.tableName);return undefined;}
		if(tableData.data == undefined){console.log("无条件查询");return undefined;}
		//var key = {index:-1,type:0,val:""};
		var key = [];
		tableKeys = this.getTableKeys(tableData.tableName);
		for(var i=0;i<tableKeys.length;i++){
			if(tableData.data[tableKeys[i].name] != undefined){
				key.push({index:i,type:tableKeys[i].type,val:tableKeys[i].type==0?escape(tableData.data[tableKeys[i].name]):tableData.data[tableKeys[i].name].toString()});
			}
		}
		if(key.length == 0){console.log("不存在的字段");return undefined;}
		return key;
	},
	getTableKeys(tableName){//获取表字段
		var dataString = this.getTableContentString();
		if(dataString == ""){return undefined;}
		var dataA = dataString.split(";");
		for(var i=0;i<dataA.length;i++){
			var dataA2 = dataA[i].split(":");
			if(dataA2[0].toUpperCase() == tableName.toUpperCase()){
				var rezultKeys = [];
				var dataA3 = dataA2[1].split(",");
				for(var j=0;j<dataA3.length;j++){
					var rezultObj = {name:"",type:0};
					var dataA4 = dataA3[j].split("|");
					rezultObj.name = dataA4[0];
					rezultObj.type = Number(dataA4[1]);
					rezultKeys.push(rezultObj);
				}
				return rezultKeys;
			}
		}
		return undefined;
	},
	setTableContentString(val,tableName){
		tableNameKey = this.DbKey;
		if(tableName == undefined||tableName == ""){}else{tableNameKey += "_" + tableName;}
		this.setStorage(tableNameKey,val);
	},
	getTableContentString(tableName){
		tableNameKey = this.DbKey;
		if(tableName == undefined||tableName == ""){}else{tableNameKey += "_" + tableName;}
		return this.getStorage(tableNameKey);
	},
	setStorage(key,val){
		try{
			localStorage.setItem(key,val);;
		}catch(err){
			console.log("错误")
			this.getSmaller();
		}
	},
	getStorage(key){
		var rezult = localStorage.getItem(key);
		if(rezult == null||rezult == "null"){rezult = ""}
		return rezult;
	},
	getSmaller(smaller){//找到最大的表，按smaller比例进行删除,smaller为删除比例，保留比为1- smaller
		alert("清除表数据");
		if(smaller == undefined){smaller = 0.5;}
		var currentTable = {tableName:"",tableContent:"",tableLength:0};
		tableList = this.getTableContentString();
		tableListA = tableList.split(";");
		for(var i=0;i<tableListA.length;i++){
			var currentTableName = tableListA[i].split(":")[0];
			var dataString = this.getTableContentString(currentTableName);
			var dataStringLength = dataString.length;
			if(dataStringLength > currentTable.tableLength){
				currentTable = {tableName:currentTableName,tableContent:dataString,tableLength:dataStringLength};
			}
		}
		tableListA = currentTable.tableContent.split(";");
		var startId = Math.floor(tableListA.length * smaller);
		var dataString2 = ""
		for(var i = startId;i<tableListA.length;i++){
			if(dataString2 == ""){dataString2 += tableListA[i];}else{dataString2 += ";" + tableListA[i];}
		}
		this.setTableContentString(dataString2,currentTable.tableName);
	}
};