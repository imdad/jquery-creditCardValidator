/*!
 * jQuery.creditCardValidator.js v1.0.0
 *
 * Copyright 2011 Johannes Röttger
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($){
	var methods = {
		init : function(options) {
			var settings = {
				success: function(value, cardType) {},
				error: function(value, cardType, message) {}
			};
			
			return this.each(function(){
				if (options) { 
					$.extend(settings, options);
				}
				
				$(this).bind('blur.creditCardValidator', function(){
					var value = $(this).val().replace(/[\-\ ]+/g,'');
					var cardType = CardType.INVALID;
					// AMEX
					if (value.match(/^3[47][0-9]{13}$/)) {
						cardType = CardType.AMEX;
					}
					// VISA
					else if (value.match(/^4[0-9]{15}$/)) {
						cardType = CardType.VISA;
					}
					// MasterCard
					else if (value.match(/^5[1-5][0-9]{14}$/)) {
						cardType = CardType.MASTERCARD;
					}
					// card not accepted
					else {
						if ('function' === typeof settings.error) {
							settings.error(value, cardType, "Invalid card type.");
						}
						return;
					}
					
					if (!luhn(value)) {
						if ('function' === typeof settings.error) {
							settings.error(value, cardType, "Luhn check failed.");
						}
						return;
					}
					
					if ('function' === typeof settings.success) {
						settings.success(value, cardType);
					}
				});
			});
		},
		destroy: function() {
			return this.each(function(){
				$(this).unbind('.creditCardValidator');
			});
		}
	};
	
	var CardType = {
		INVALID: "invalid",
		VISA: "visa",
		AMEX: "amex",
		MASTERCARD: "mastercard"
	}
	
	var luhn = function(input) {
		var character,
			sum = 0,
			mul = 1,
			length = input.length;
			
	    while (length--) {
			character = parseInt(input.charAt(length), 10) * mul;
			sum += character - (character > 9) * 9;
			mul ^= 3;
	    }
	    return sum > 0 && (sum % 10 === 0);
	};
	
	$.fn.creditCardValidator = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ('object' === typeof method || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.creditCardValidator');
		}
	};
})(jQuery);