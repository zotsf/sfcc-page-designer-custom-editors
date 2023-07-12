'use strict';

var HashMap = require('dw/util/HashMap');
var PageMgr = require('dw/experience/PageMgr');
var URLUtils = require('dw/web/URLUtils');

module.exports.init = function (editor) {
	if (!editor.configuration) {
		editor.configuration = new HashMap();
	}
	editor.configuration.put('iconURL', URLUtils.staticURL('/experience/editors/icons/').https().toString());
	var breakoutEditor = PageMgr.getCustomEditor('breakout.accordionBreakout', editor.configuration);
	editor.dependencies.put('accordionBreakout', breakoutEditor);
};
