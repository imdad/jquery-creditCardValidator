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
				event: 'blur',
				success: function(value, cardType) {},
				error: function(value, cardType, message) {}
			};
			
			return this.each(function(){
				if (options) { 
					$.extend(settings, options);
				}
				
				$(this).bind(settings.event + '.creditCardValidator', function() {
					var value = $(this).val().replace(/[\-\ ]+/g,'');
					var cardType = CardType.INVALID;
					
					$.each(cards, function(c, card){
						$.each(card.patterns, function(p, pattern){
							if (value.match(pattern)) {
								cardType = card.type;
							}
						});
					});
					
					if (cardType === CardType.INVALID) {
						if ('function' === typeof settings.error) {
							settings.error(value, CardType.INVALID, "Invalid card type.");
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
	
	var cards = {
		'amex': {
			patterns: [
				/^3[47][0-9]{13}$/
			],
			type: CardType.AMEX
		},
		'visa': {
			patterns: [
				/^4[0-9]{15}$/
			],
			type: CardType.VISA
		},
		'mastercard': {
			patterns: [
				/^5[1-5][0-9]{14}$/
			],
			type: CardType.MASTERCARD
		}
	};
	
	
	
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