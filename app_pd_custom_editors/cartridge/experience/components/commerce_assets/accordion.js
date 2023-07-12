'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
var customEditorHelper = require('*/cartridge/experience/utilities/customEditorHelper.js');

module.exports.render = function (context) {
	var model = new HashMap();
	var content = context.content;

	var standardFields = [
		"accordion",
		{
			id: 'componentID',
			default: 'accordion' + context.component.ID // need to prepend a letter as the machine generated id can start with a number which is an invalid HTML ID and will break the accordion.
		}
	];

	model = PageRenderHelper.fieldMapper(standardFields, model, content);

	model.styles = "";

	model.classes = "component-accordion";
	model.classes += " bg-" + model.theme;

	PageRenderHelper.addCustomClassOrID(context);
	return new Template('experience/components/commerce_smgassets/accordion').render(model).text;
};
