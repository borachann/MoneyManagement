(function() {
	var svc_attrs = {
		"id"				: "data-jx-svc"
		, "onload"			: "data-jx-svc-onload"
		, "source"			: "data-jx-svc-source"
		, "target"			: "data-jx-svc-target"
		, "targetMethod" 	: "data-jx-svc-target-method"
		, "handleBefore"	: "data-jx-svc-handle-before"
		, "handleComplete" 	: "data-jx-svc-handle-complete"
		, "formcheck"		: "data-jx-svc-formcheck"
		, "executer"		: "data-jx-svc-execute"
		, "dummy"           : "data-jx-svc-dummy"
	};

	var jexSvcPlugin = JexPlugin.extend({
		init : function() {
			this.isSyncGroup = jex.checkDevice(jex.get("_SYNC_GROUP_"));
		},

		load : function(attr, $jq, jobManager) { // 세 번째 인자인 jobManager는 jex.procedure.js 에서 svc 플러그인을 생성할 때 넣어준다.
			var self 			= this,
				handleBefore,
				handleComplete;

			this.$object 	= $jq;
			this.svc 		= this.$object.attr(attr);
			this.onload 	= ("true" == this.$object.attr(svc_attrs.onload));
			this.$object	= this.$object;

			this.formcheck 	= !("false" === this.$object.attr(svc_attrs.formcheck));


			this.source 	= this.parseSource(this.$object.attr(svc_attrs.source));
//			this.source     = this.$object.attr(svc_attrs.source);

			this.target 	= this.parseTarget(this.$object.attr(svc_attrs.target));
			this.setTarget(this.$object.attr(svc_attrs.target));

			this.targetMethod = this.$object.attr(svc_attrs.targetMethod);


			/**
			 * handleBefore에 정의되는 callback 함수는 하나의 파라미터를 받아서 전처리를 수행할 수 있다.
			 * @type pluginObject {object} svc plugin 객체를 받는다.
			 */
			handleBefore = getMethodByNamespace(this.$object.attr(svc_attrs.handleBefore));
			if (typeof handleBefore === "function")		this.handleBefore = handleBefore;

			/**
			 * handleComplete에 정의되는 callback 함수는 두 개의 파라미터를 받아서 후처리를 수행할 수 있다.
			 * @type pluginObject {object} svc plugin 객체를 받는다.
			 * @type dat {object} ajax 호출 결과로 받은 json 데이터를 받는다.
			 */
			handleComplete = getMethodByNamespace(this.$object.attr(svc_attrs.handleComplete));
			if (typeof handleComplete === "function")	this.handleComplete = handleComplete;

			this.eexecute	= this.$object.attr(svc_attrs.executer);		// #DIV_ID

			this.jobManager = jobManager;

			/**
			 * @param dat {json} 서버로부터 서비스 호출 결과 데이터를 받는다.
			 * 현재 서비스가 jobManager에 의해 실행되고 있을 경우, self.jobManager.stop() 을 호출해준다.
			 */
			this.successFn = function(dat) {
				if (jex.isError(dat)) {
					if (self.jobManager instanceof _JexJobManager) {
						self.jobManager.clear();
						self.jobManager.stop();
					}

					jex.printError("Error Message");
					return;
				}

				if (typeof self.handleComplete === "function")	self.handleComplete(self, dat);

				jex.setAll(self.target, self.getTargetData(dat), undefined, true, self.targetMethod);

				jex.bindExecuter(self.eexecute, "Svc Executer", self.$object);

				if (self.jobManager instanceof _JexJobManager) {	self.jobManager.stop();		}
			};

			// 현재 서비스가 dummy로 작동할 경우 execute_service($jq, $evt) 함수를 dummy 함수로 변경한다.
			if (this.$object.attr(svc_attrs.dummy)) {
				this.setDummy(this.$object.attr(svc_attrs.dummy));
			}

			if (this.onload) 		this.execute_service(this.$object);
		},
		parseSource : function(userInput) {
			var source = [];
			if (typeof userInput !== 'string' || userInput.length === 0) {
				source.push("body");
			} else {
				var inputList = userInput.split(";"),
					inputListLength = inputList.length,
					i;

				for (i = 0; i < inputListLength; i++) {
					source.push(this.parseSourceItem($.trim(inputList[i])));
				}
			}

			return source;
		},

		parseSourceItem : function(userInput){
			if ("this" === userInput)											return this.$object;

			if (userInput.startsWith("parent")) {
				var parents = userInput.split(".");

				var resultObject = this.$object;
				for (var i = 0, length = parents.length; i < length; i++) {
					if ("" == parents[i] || "parent" != parents[i])		throw new Error("잘못된 parent 입니다. : " + userInput + " -> " + parents[i]);

					var tmpParent = resultObject.parent();
					if (0 == tmpParent.length)							throw new Error("존재하지 않는 parent 입니다. : " + userInput + " -> " + parents[i]);

					resultObject = tmpParent;
				}

				return resultObject;
			}

            return userInput;
		},

		parseTarget : function(userInput){
			if (typeof userInput !== "string" || userInput.length === 0)        return "body";

			if ("this" === userInput)											return this.$object;

			if (userInput.startsWith("parent")) {
				var parents = userInput.split(".");

				var resultObject = this.$object;
				for (var i = 0, length = parents.length; i < length; i++) {
					if ("" == parents[i] || "parent" != parents[i])		throw new Error("잘못된 parent 입니다. : " + userInput + " -> " + parents[i]);

					var tmpParent = resultObject.parent();
					if (0 == tmpParent.length)							throw new Error("존재하지 않는 parent 입니다. : " + userInput + " -> " + parents[i]);

					resultObject = tmpParent;
				}

				return resultObject;
			}

            return userInput;
		},


		/**
		 *
		 * @param evt {Mouse Event}
		 * @param $jq
		 */
		execute				: function(evt, $jq) {
			this.execute_service($jq, evt);
		},

		execute_service	: function($jq, evt) {
			var ajax = jex.createAjaxUtil(this.svc);

			if (!this.checkForm())		return false;

			//ajax.set(jex.getAll(this.source));
			ajax.set(this.getSource(this.source));
			ajax.setErrTrx(false);

			if (typeof this.handleBefore === "function")	this.handleBefore(this);

			ajax.execute(this.successFn);
		},

		successFn : function(data){
		},

		isSync : function(){
			return this.isSyncGroup;
		},
		checkForm : function(){
			if (this.formcheck) {
				var checker = jex.plugin.get("FORM_CHECKER");

				if (!checker) {
					//alert("MOBILE_FORM_CHECKER가 정의되지 않았습니다.");
					//return false;
					return true;
				}

				var msg = checker.check(this.source);

				if (!msg || msg.length == 0)			return true;
				else {
					jex.printInfo(msg);
					return false;
				}
			} else {
				return true;
			}

			return false;
		},

		getSource : function(source) {
			var result = {};

			for (var i = 0; i < source.length; i++) {

                if (typeof source[i] === "string" && source[i].indexOf(":") != -1) {
                    var keyValue = source[i].split(":"),
                        key = $.trim(keyValue[0]),
                        value = $.trim(keyValue[1]);

                    if (value.startsWith("#")) {
                        result[key] = $(value).getTagValue();
                    } else {
                        result[key] = value;
                    }
                } else {
                    $.extend(result, jex.getAll(source[i]));
                }
			}

			return result;
		},

		setTarget : function(userInput){
			if (userInput == null)       return;

			var arr = userInput.split("@");
			this.target = arr[0];

			if (arr[1] == null || arr[1] === "")    return;

			this.targetKey = arr[1];
		},
		getTargetData : function(data){
			if (this.targetKey == null || data == null)      return data;

			var keys = this.targetKey.split(".");

			var result = data;

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];

				if (result[key] != null)        result = result[key];
				else                            return data;
			}

			return result;
		},

		/**
		 * Dummy 모드로 서비스 사용하고 싶을 때 다음 형식에 맞는 데이터가 필요하다.
		 *
		 * { COMMON_HEAD : { ERROR : "FALSE" }, // 생략가능
		 *   OBJECT_WHAT_YOU_WANTED : {}}
		 *
		 * 사용 예)
		 * <... data-jx-svc-dummy="dummy.sample1" ...>
		 * <script>
		 *     var dummy = {
		 *          sample1 : function() {
		 *              return { OBJECT_WHAT_YOU_WANTED : {} };
		 *          }
		 *     };
		 * </script>
		 */
		setDummy : function(dummyData){
			if (!dummyData)         return;

			var expectedData = {};

			var getDummyDataFromFunction = getMethodByNamespace(dummyData);

			var self = this;

			this.execute_service = function($jq, $evt) {
//				var source = jex.getAll(self.source);
				var source = self.getSource(self.source);

				expectedData = getDummyDataFromFunction(source);
				if (!expectedData["COMMON_HEAD"]) { expectedData["COMMON_HEAD"] = { 	ERROR : false	}; 	}

				if (typeof self.handleBefore === "function")		self.handleBefore(self);

				self.successFn(expectedData);
			};
		}
	});

	/**
	 * window scope 에서 접근 가능한 namespace 에 대해서 '.' 을 seperator 로 하여 마지막 string 에 해당하는 값의 객체를 리턴해준다.
	 * @param namespace {String} "my.object.methodName"
	 */
	function getMethodByNamespace(namespace){
		if (typeof namespace !== 'string' || namespace.length == 0)							return null;

		var namespaceSplit 			= namespace.split("."),
			namespaceSplitLength 	= namespaceSplit.length,
			handleMethod 			= window[namespaceSplit[0]],
			i;


		if (typeof handleMethod !== 'object' && typeof handleMethod !== 'function')			return null;

		for (i = 1; i < namespaceSplitLength; i++) {
			handleMethod = handleMethod[namespaceSplit[i]];

			if (typeof handleMethod !== "object" && typeof handleMethod !== 'function')		return null;
		}

		return handleMethod;
	}

	jex.plugin.add("JEX_SVC",	jexSvcPlugin, svc_attrs.id);
})();
