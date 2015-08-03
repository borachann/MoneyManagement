(function() {
	/**
	 * 
	 * 
	 */
	var jexExecuterPlugin = JexPlugin.extend({
		init : function() {
		}, load : function(attr, $jq) {
			var _executer_this = this;
			this.action = $jq.attr("data-jx-execute");
			this.target = $jq.attr("data-jx-execute-target");
			this.checker= $jq.attr("data-jx-execute-checker");
			
			$jq.bind(this.action, function(evt) {
				jex.set("_jex_last_evt",$jq);
				
				jex.printDebug("Executer :: " + _executer_this.action + ", _executer_this :: "+ _executer_this.checker +", _executer_this.target :: " + _executer_this.target);
				
				if (_executer_this.checker) {
					try {
						jex.bindExecuter(_executer_this.checker,evt,$jq);
					} catch (e) {
						jex.checkException(e);
						return;
					}
				}
				
				var target;
				if (!_executer_this.target)	target = $jq;
				else 							target = _executer_this.target;
				try {
					jex.bindExecuter(target,evt,$jq);
				} catch (e) {
					jex.checkException(e);
					return;
				}
			});
		}
	});
	jex.plugin.add("JEX_EXECUTER",	jexExecuterPlugin, "data-jx-execute");
})();