'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');


/**
 * Render logic for storefront.imageAndText component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;

    var fields = [
        'links'
    ]
    model = PageRenderHelper.fieldMapper(fields, model, content);
    model.links = PageRenderHelper.linkCustomEditorHandler(model.links);

    return new Template('experience/components/commerce_smgsimple/simpleLink').render(model).text;
};
