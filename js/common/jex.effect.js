/**
 * User: kwakyc
 * Date: 13. 4. 18.
 * Time: 오후 6:28
 *
 */
(function () {
    var effectAttrs = {
        id: "data-jx-effect"
    };

    var JexEffectPlugin = JexPlugin.extend({
        init: function () {
            this.allowedEffect = {
                blind: {},
                bounce: {},
                clip : {},
                drop : {},
                explode : {},
                fade : {},
                fold : {},
                highlight: {},
                puff : {},
                pulsate : {},
                scale : {  	percent : 0  },
                shake : {},
                slide : {
                    "right":"direction"
                },
                transfer : {}
            };

            this.effect = "";
            this.optionOfEffect = {};
        },

        /**
         * @method load
         * data-jx-effect 에 해당하는 속성 값이 읽혀질 때 호출되는 메소드
         */
        load: function (attr, $object) {
            this.$object = $object;

            this.initEffect($object.attr(effectAttrs.id));
        },

        show : function(effect, option){
			if (typeof effect === "string" && effect.length > 0) {
				this.$object.show(effect, option);
			} else {
				this.$object.show(this.effect, this.optionOfEffect);
			}
        },

        hide : function(effect, option){
			if (typeof effect === "string" && effect.length > 0) {
				this.$object.hide(effect, option);
			} else {
				this.$object.hide(this.effect, this.optionOfEffect);
			}
        },

        /**
         *  private method
         */
        initEffect : function(userEffect){
            if(userEffect == null)			return null;

            var effectWithOptions = userEffect.split("@");

            var effect = effectWithOptions[0];

            if(this.isAllowedEffect(effect)){
                this.effect = effect;

                var option = effectWithOptions[1];

                if (option == null)		return;

                var optionName = this.allowedEffect[effect][option];

                if(optionName != null){
                    this.optionOfEffect[optionName] = option;
                }
            }
        },
        isAllowedEffect : function(effect){
            return effect && this.allowedEffect[effect];
        }
    });

    jex.plugin.add("JEX_EFFECT", JexEffectPlugin, effectAttrs.id);
})();