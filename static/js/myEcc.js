var myEcc = {
	privateKey:"814901212060618457627829850959065715828967143232",
	getCurve:function(){
		return new ECCurveFp(
			new BigInteger("1461501637330902918203684832716283019653785059327"),
			new BigInteger("1461501637330902918203684832716283019653785059324"),
			new BigInteger("163235791306168110546604919403271579530548345413")
		);
	},
	getG:function(curve){
		return new ECPointFp(
			curve,
			curve.fromBigInteger(new BigInteger("425826231723888350446541592701409065913635568770")),
			curve.fromBigInteger(new BigInteger("203520114162904107873991457957346892027982641970"))
		);
	},
	createPrivate(){
		var rn = new SecureRandom();
		var n = new BigInteger("1461501637330902918203687197606826779884643492439");
		var n1 = n.subtract(BigInteger.ONE);
		var r = new BigInteger(n.bitLength(), rn);
		return r.mod(n1).add(BigInteger.ONE).toString(16);
	},
	getPublicKey:function(privateKey){
		var a = new BigInteger(privateKey,16);
		var curve = this.getCurve();
		var G = this.getG(curve);
		var P = G.multiply(a);
		return P.getX().toBigInteger().toString(16) + "l" + P.getY().toBigInteger().toString(16);
	},
	generateKey(){
		var pik = this.createPrivate();
		var puk = this.getPublicKey(pik);
		return {privateKey:pik,publicKey:puk}
	},
	getKey:function(privateKey,publicKey){
		//var cacheKey = privateKey + publicKey;
		//var cacheContent = myCache.get(cacheKey);
		//if(cacheContent!=""){return cacheContent;}
		
		var curve = this.getCurve();
		publicKey = this.formatPublicKey(publicKey);
		var P = new ECPointFp(curve,
			curve.fromBigInteger(new BigInteger(publicKey.x,16)),
			curve.fromBigInteger(new BigInteger(publicKey.y,16)));
		var a = new BigInteger(privateKey,16);
		var S = P.multiply(a);
		var result = S.getX().toBigInteger().toString(16) + S.getY().toBigInteger().toString(16);
		//myCache.set(cacheKey,result);
		return result;
	},
	formatPublicKey(publicKey){
		var p1 = publicKey.split("l");
		return {x:p1[0],y:p1[1]};
	}
	
};