'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var StringUtils = require('dw/util/StringUtils');
var ImageTransformation = require('*/cartridge/experience/utilities/ImageTransformation.js');


/**
 * Render logic for storefront.imageAndText component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @returns {string} The template to be displayed
 */
module.exports.render = function (context) {
    var model = new HashMap();
    var content = context.content;

    var richText = content.richText.output ? content.richText.output : '';
    model.innerHTML = richText;

    return new Template('experience/components/commerce_smgsimple/simpleRichText').render(model).text;
};
