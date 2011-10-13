# jQuery credit card validation and type detection plugin

## Overview

This plugin checks the given input field's content for a valid credit card number and detects the card type.

## Usage

	$("#creditCardTextField").creditCardValidator({
		success: function(cardNo, cardType) {
			console.log(cardNo + " (Type: " + cardType + ") is valid.");
		},
		error: function(cardNo, cardType, message) {
			console.log(cardNo + " (Type: " + cardType + ") is invalid. Error message: " + message);
		}
	});

## Parameters

* ```event```: (String, Default ```blur```) Defines the event on which the validation is happening.
* ```success```: (Function, Default ```function(cardNo, cardType)```) This function is executed if the validation is successful.
* ```error```: (Function, Default ```function(cardNo, cardType, message)```) This function is executed if the validation fails.