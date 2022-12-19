var myRSA = {
	publicKey:"",
	privateKey:"",
	getRsaKeys:function(func){
		var that = this;
		window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048, //can be 1024, 2048, or 4096
				publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
				hash: {name: "SHA-512"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
			},
			true, //whether the key is extractable (i.e. can be used in exportKey)
			["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
		).then(
			function(key){
				window.crypto.subtle.exportKey(
					"pkcs8", 
					key.privateKey 
				).then(
					function(keydata1){
						window.crypto.subtle.exportKey(
							"spki",
							key.publicKey 
						).then(
							function(keydata2){
								that.privateKey = that.RSA2text(keydata1,1);
								that.publicKey = that.RSA2text(keydata2);
								//console.log(that.privateKey);
								//console.log(that.publicKey);
								func(that.privateKey,that.publicKey,that.RSA2text2(keydata1,1));
							}
						).catch(function(err){
							console.error(err);
						});
					}
				)
				.catch(function(err){
					console.error(err);
				});
			}
		)
		.catch(function(err){
			console.error(err);
		});
	},
	RSA2text:function(buffer,isPrivate=0) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var base64 = window.btoa(binary);
        var text = "-----BEGIN "+(isPrivate?"PRIVATE":"PUBLIC")+" KEY-----\n";
        text += base64.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{64}\x01?/g,"$&\n");
        text += "\n-----END "+(isPrivate?"PRIVATE":"PUBLIC")+" KEY-----";
        return text;
	},
	RSA2text2:function(buffer,isPrivate=0) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var base64 = window.btoa(binary);
        var text = base64.replace(/[^\x00-\xff]/g,"$&\x01").replace(/.{64}\x01?/g,"$&\n");
        return text;
	},
	jiami(str) {
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.publicKey);
        let encrypted = encrypt.encrypt(str);
        return encrypted
        //console.log('加密后数据:%o', encrypted);

    },
    jiemi(str) {
        //使用私钥解密
        let decrypt = new JSEncrypt();
        decrypt.setPrivateKey(this.privateKey);
        let uncrypted = decrypt.decrypt(str);
        return uncrypted;
        //console.log('解密后数据:%o', uncrypted); // 张三
    }
};