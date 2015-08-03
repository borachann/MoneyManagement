/**
 * 
 * <div class="topWrap" data-jx-view='all'>
 * 
 * pad
 * pad,phone
 * 
 * group1
 * 
 */
(function() {
	var jexViewPlugin = JexPlugin.extend({
		init : function() {
			this.debug = false;
		},
		load : function(attr, $jq) {
			this.$object		= $jq;
			this.attr			= attr;
			this.device			= $jq.attr(attr);

			this.viewControlByClientPlatform();
			
			if(this.debug){
				var messageOfDevice = "type : " + this.device + " | ";
				
				alert(messageOfDevice);
			}
		},
		hide : function() {
			this.$object.hide();
		},
		show : function() {
			this.$object.show();
		},
		viewControlByClientPlatform : function(){
			var $object = this.$object;
			
			if(jex.checkDevice(this.device))			$object.show();
			else										$object.hide();
		}
	});
	jex.plugin.add("JEX_VIEW",	new jexViewPlugin(), "data-jx-view");
})();