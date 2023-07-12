'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');

/**
 * Render logic for the storefront.simpleList component
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
	var defaultSettings = context.content.defaultSettings;

	var containerClassesArray = [];
	if (defaultSettings.itemClass) containerClassesArray.push(defaultSettings.itemClass);
	if (defaultSettings.themeColor) containerClassesArray.push(defaultSettings.themeColor);

	var containerStylesArray = [];
	model.containerClasses = containerClassesArray.join(' ');

	model.itemID = defaultSettings.itemID ? defaultSettings.itemID : '';


    return new Template('experience/components/commerce_smgsimple/defaultSettings').render(model).text;
};
