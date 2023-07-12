'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');


/**
 * Render logic for storefront.imageAndText component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;

    model.alignmentClasses = 'text-' + content.textAlign.alignMobile + ' text-lg-' + content.textAlign.alignDesktop;
    model.someText = content.someText ? content.someText : ''; 

    return new Template('experience/components/commerce_smgsimple/coreComponent').render(model).text;
};
