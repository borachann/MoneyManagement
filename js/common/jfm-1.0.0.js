
var HttpRequest = function() {
};

HttpRequest.prototype.execute = function(params, success, fail) {
	return Cordova.exec(success, fail, 'HttpRequest', 'execute', [params]);
};
HttpRequest.prototype.getUserAgent = function(success, fail) {
    return Cordova.exec(success, fail, 'HttpRequest', 'getUserAgent', []);
};

if (!window.plugins) {
	window.plugins = {};
}

if (!window.plugins.HttpRequest) {
	window.plugins.HttpRequest = new HttpRequest();
}

////////////////////////////////////////////////////////////////////////////////////

var JfmStorage = function() {
};

JfmStorage.prototype.appGet = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'appGet', [key]);
};
// register id 
JfmStorage.prototype.appRegisterIdGet = function(success, fail) {
    return Cordova.exec(success, fail, 'JfmStorage', 'appRegisterIdGet', []);
}; 

//push message get
JfmStorage.prototype.appPushMessageGet = function(success, fail) {
    return Cordova.exec(success, fail, 'JfmStorage', 'appPushMessageGet', []);
}; 

// push message remove
JfmStorage.prototype.appPushMessageRemove = function(key, success, fail) {
    return Cordova.exec(success, fail, 'JfmStorage', 'appPushMessageRemove', [key]);
};

JfmStorage.prototype.appSet = function(key, value, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'appSet', [key, value]);
};

JfmStorage.prototype.appRemove = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'appRemove', [key]);
};

JfmStorage.prototype.appClear = function(success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'appClear', []);
};

JfmStorage.prototype.loginGet = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'loginGet', [key]);
}; 

JfmStorage.prototype.loginSet = function(key, value, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'loginSet', [key, value]);
};

JfmStorage.prototype.loginRemove = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'loginRemove', [key]);
};

JfmStorage.prototype.loginClear = function(success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'loginClear', []);
};

JfmStorage.prototype.paramGet = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'paramGet', [key]);
}; 

JfmStorage.prototype.paramSet = function(key, value, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'paramSet', [key, value]);
};

JfmStorage.prototype.paramRemove = function(key, success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'paramRemove', [key]);
};

JfmStorage.prototype.paramClear = function(success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'paramClear', []);
};

JfmStorage.prototype.HIGCall = function(success, fail) {
	return Cordova.exec(success, fail, 'JfmStorage', 'HIGCall', []);
};

if (!window.plugins) {
	window.plugins = {};
}

if (!window.plugins.JfmStorage) {
	window.plugins.JfmStorage = new JfmStorage();
}


////////////////////////////////////////////////////////////////////////////////////

var QrCode = function() {
};

QrCode.prototype.scan = function(success, fail) {
	return Cordova.exec(success, fail, 'QrCode', 'scan', []);
};


if (!window.plugins) {
	window.plugins = {};
}

if (!window.plugins.QrCode) {
	window.plugins.QrCode = new QrCode();
}

////////////////////////////////////////////////////////////////////////////////////

var userAgent = navigator.userAgent.toLowerCase();

function JFMNativeGo(value)
{
	if(userAgent.match('android')) {
		//안드로이드
		JFMNative.go(value);
	}
	else
	{
		//아이폰
		var NativeControl = function() {
		};

		NativeControl.prototype.Link = function(key,success, fail) {
			return Cordova.exec(success, fail, 'NativeControl', 'Link', [key]);
		};

		if (!window.plugins) {
			window.plugins = {};
		}

        NativeControl = new NativeControl();
		
		NativeControl.Link(value);
	}
}

function JFMNativeDocReader(value)
{
	if(userAgent.match('android')) {
		//안드로이드
		JFMNative.docReader(value);
	}
	else
	{
		//아이폰
		var JFMIphone = function() {
		};

		JFMIphone.prototype.docReader = function(key,success, fail) {
			return Cordova.exec(success, fail, 'JFMIphone', 'docReader', [key]);
		};

		if (!window.plugins) {
			window.plugins = {};
		}

        JFMIphone = new JFMIphone();
		
		JFMIphone.docReader(value);
	}
}

function Certcall()
{
    //아이폰
    var Cert = function() {
    };
    
    Cert.prototype.CertCalling = function(success, fail) {
        return Cordova.exec(success, fail, 'Cert', 'CertCalling', []);
    };
   
    if (!window.plugins) {
        window.plugins = {};
    }
    
    if (!window.plugins.Cert) {
        window.plugins.Cert = new Cert();
    }

   

}

