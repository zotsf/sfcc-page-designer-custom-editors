/* eslint-disable valid-jsdoc */

'use strict';

var base = module.superModule;

var HashMap = require('dw/util/HashMap');
var URLUtils = require('dw/web/URLUtils');

/**
 * @function createDefaultRegionClass
 * @description Create default class depends on region ID.
 *
 * @param {string} regionID - region ID
 * @return {string} - default class depends on region ID
 */
function createDefaultRegionClass(regionID) {
	return empty(regionID)
		? ''
		: 'experience-region experience-' + regionID.replace(/\./g, '-');
}

/**
 * @function createDefaultComponentClass
 * @description Create default class depends on component type ID.
 *
 * @param {string} componentTypeID - component type ID
 * @return {string} - default class depends on component type ID
 */
function createDefaultComponentClass(componentTypeID) {
	return empty(componentTypeID)
		? ''
		: 'experience-component experience-' + componentTypeID.replace(/\./g, '-');
}

/**
 * Set name/value attribute pair at given settings object, this can be a settings
 * of a component, a region and either default or a specific one.
 *
 * @param {*} renderSettings region or component rendering settings
 * @param {string} name the attribute name to set
 * @param {string} value the attribute value to set
 */
function setAttribute(renderSettings, name, value) {
	if (renderSettings !== null) {
		var attr = renderSettings.getAttributes() || new HashMap();
		attr.put(name, value);
		renderSettings.setAttributes(attr);
	}
}

/**
 * @function manageLinkFiltersQueries
 * @description Handle conditions for ajax filters and link query strings
 *
 * @param {array} links the current component's array of links
 * @param {Object} model the current context's content
 *
 * note: you can set elementClass in a component JS file to pass here to identify a general class for that component
 */
function manageLinkFiltersQueries(linksArray, model) {
	if (linksArray) {
		var linksOutput = [];
		var isFilter;
		let links = linksArray.linksArray;
		for (let i = 0; i < links.length; i++) {
			isFilter = false;
			if (links[i].linkBuilder && links[i].linkBuilder[0] === 'Search-Show' && links[i].linkSpotlight === true) {
				isFilter = true;
				links[i].spotlightLinkSrc = '#afterSpotlight';
				links[i].spotlightLinkDataHref = URLUtils.url('Search-ShowAjax') + '?' + links[i].linkBuilder[2];
			} else if (!empty(links[i].linkQueryString)) {
				links[i].href += '?' + links[i].linkQueryString;
			}
			linksOutput.push({
				isFilter: isFilter,
				link: links[i]
			});
		}
		model.links = linksOutput;
		model.linksColWidth = (12 / links.length).toString();
	}
	return model;
}

/**
 * @function addCustomClassOrID
 * @description Add custom Class or ID to the Component wrapper.
 *
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 *
 * note: you can set elementClass in a component JS file to pass here to identify a general class for that component
 */
function addCustomClassOrID(context) {
	var content = context.content;

	if (content.componentID || content.componentClass) {
		var component = context.component;
		var componentRenderSettings = context.componentRenderSettings;
		var componentClass = createDefaultComponentClass(component.getTypeID());

		if (content.componentClass) {
			componentClass += ' ' + content.componentClass;
		}
		if (content.elementClass) {
			componentClass += ' ' + content.elementClass;
		}

		if (content.componentID) {
			setAttribute(componentRenderSettings, 'id', content.componentID);
		}

		setAttribute(componentRenderSettings, 'class', componentClass);
	}
}

/**
 * @function fieldMapper
 * @description automatically map fields from content to model taking into account default and mapped values.
 *
 * @param {Object} fields an object containing the fields to be mapped from content to model, along with any settings requested.
 * @param {Object} model the current context's content
 * @param {Object} content the current model
 *
 * @return {Object} - the updated model
 *
 */
function fieldMapper(fields, model, content) {
	fields.forEach(function (field) {
		var fieldID;
		if (typeof field === 'string') {
			fieldID = field;
		} else if (typeof field === 'object' && 'id' in field) {
			fieldID = field.id;
		}

		if (!empty(fieldID)) {
			var modelValue;

			if (content[fieldID]) {
				modelValue = content[fieldID];
			} else if (typeof field === 'object' && 'default' in field) {
				modelValue = field.default;
			}

			if (!empty(modelValue) || (modelValue === "" && field.default === "")) {
				model[fieldID] = modelValue;
				if (typeof field === 'object' && 'mapping' in field) {
					model[fieldID + "Mapped"] = field.mapping[modelValue];
				}
			}
		}
	});

	return model;
}

/**
 * @function linkCustomEditorHandler
 * @description automatically builds the link(s) passed back from the link custom editor
 *
 * @param {Object} - linkObject the value of the link custom edior field.
 *
 * @return {Object} - the updated linkObject object
 *
 */
function linkCustomEditorHandler(linkObject) {
	if (linkObject && linkObject.linksArray && linkObject.linksArray.length > 0) {
		for (let i = 0; i < linkObject.linksArray.length; i++) {
			var link = linkObject.linksArray[i];
			if (link.linkIsArray) {
				link.href = URLUtils.url(link.linkBuilder[0], link.linkBuilder[1], link.linkBuilder[2]);
			} else {
				link.href = link.linkBuilder;
			}

			if (link.clubConfigurator) {
				var clubConfigsIterator = link.clubConfigurator.keySet().iterator();
				while (clubConfigsIterator.hasNext()) {
					var prop = clubConfigsIterator.next();
					var field = link.clubConfigurator.get(prop);
					if (field.value !== '') {
						link.href.append(prop, field.value);
					}
				}
			}

			// build a link for images that we can add #config to (image links don't use the Pricing-ClubBuyButton controller since they don't have any button representation)
			link.imageHref = link.href;
			if (link.linkToConfig) {
				link.imageHref = link.href + "#config";
			}
			var stylesArray = [];
			// stylesArray = ['btn', link.classes, link.style, link.buttonWidth, link.buttonAlign];
			stylesArray.push('btn', link.classes, link.style, link.buttonWidth, link.buttonAlign);
			if (link.smoothScroll) {
				stylesArray.push('smooth-scroll');
			}

			link.classString = stylesArray.join(' ');
			var gtmNullDefaults = { action: null, category: null, label: null }; // used for builders that don't define defaults
			var gtmDefault = linkObject.gtmDefault ? linkObject.gtmDefault : gtmNullDefaults;
			link.gtmAction = link.gtmAction ? link.gtmAction : gtmDefault.action;
			link.gtmCategory = link.gtmCategory ? link.gtmCategory : gtmDefault.category;
			link.gtmLabel = link.gtmLabel ? link.gtmLabel : gtmDefault.label;

			link.gtmAttributes = link.gtmAction ? 'data-eventaction="' + link.gtmAction + '"' : '';
			link.gtmAttributes += link.gtmLabel ? ' data-eventlabel="' + link.gtmLabel + '"' : '';
			link.gtmAttributes += link.gtmCategory ? ' data-eventcategory="' + link.gtmCategory + '"' : '';
		}
	}
	return linkObject;
}

/**
 * @function calculateImageWidth
 * @description automatically calculates the width an image will need to be based on the current grid, screen resolution, and component
 *
 * @param {int} - columnWidth the width of a column on the current grid
 * @param {int} - columnSpan the number of columns this image will span
 * @param {int} - gutterWidth the width of a gutter on the current grid
 * @param {Object} - containerToImageWidthOperations an object holding the operators to manipulate the automatic calculation by.

 * @return {int} - the calculated image width
 *
 */
function calculateImageWidth(columnWidth, columnSpan, gutterWidth, containerToImageWidthOperations) {
	// note: these image sizes are based on the browser's width, which does not take into account the scroll bar width.
	// so if you notice the site consistantly asking for images that are slightly larger than needed, it is most likely because your scroll bar
	// is making the actual screen real estate slightly smaller than we know about.

	var totalColumnSpanWidth = columnWidth * columnSpan;
	var totalGutterSpanWidth = gutterWidth * (columnSpan - 1);
	var totalComponentWidth = totalColumnSpanWidth + totalGutterSpanWidth;
	var imageWidthAfterOperations = (containerToImageWidthOperations.ratio * totalComponentWidth) + containerToImageWidthOperations.plus;

	// return result rounded up (an image can be too large, but if it's too small it'll look degraded).
	return Math.ceil(imageWidthAfterOperations);
}

/**
 * @function setImageUrlArgs
 * @description Manages the creation of the image transformation url argument
 *
 * @param {Object} - the image transformation object
 * @param {int} - the requested image width.

 * @return {Object} - the updated image transformation object
 *
 */
function setImageUrlArgs(args, width) {
	// reset args
	args.retina = args.default;
	args.standard = args.default;

	if (!empty(width) && width > 0) {
		args.standard.scaleWidth = width;
		args.retina.scaleWidth = width * 2;
	}

	return args;
}

/**
 * @function generateResponsiveImageObject
 * @description builds the image link object which will contain links to the DIS for the properly sized image for every breakpoint we've defined
 *
 * @param {Object} - desktopImage the image object to display on desktop resolutions
 * @param {Object} - mobileImage the image object to display on mobile resolutions
 * @param {Object} - gridSettings current grid settings
 * @param {Object} - gridData data about the current grid
 * @param {Object} - containerToImageWidthOperations the value of the link custom edior field.
 * @param {Object} - aspectRatioOverride force a new aspectRatio.
 *
 * @return {Object} - the updated breakpointImages object
 *
 */
function generateResponsiveImageObject(desktopImage, mobileImage, gridSettings, gridData, containerToImageWidthOperations, aspectRatioOverride) {
	var Site = require('dw/system/Site');
	var urlEncodeSpaces = require("~/cartridge/scripts/util/stringHelpers").urlEncodeSpaces;
	var imageCompression = Site.current.getCustomPreferenceValue('pdImageQuality');

	var desktopFile;
	var mobileFile;
	var desktopAspectRatio;
	var mobileAspectRatio;
	var originalImageWidth;
	var originalImageHeight;

	var imageUrlArgs = {
		default: { quality: imageCompression }
	};
	imageUrlArgs = setImageUrlArgs(imageUrlArgs);

	if (desktopImage instanceof dw.experience.image.Image) {
		desktopFile = desktopImage.file;
		mobileFile = mobileImage.file;
		desktopAspectRatio = desktopImage.metaData.height / desktopImage.metaData.width;
		mobileAspectRatio = mobileImage.metaData.height / mobileImage.metaData.width;
		originalImageWidth = desktopImage.metaData.width;
		originalImageHeight = desktopImage.metaData.height;
	} else {
		// product images return the direct Class File, not a Class Image that contains a File
		desktopFile = desktopImage;
		mobileFile = mobileImage;
		originalImageWidth = '';
		originalImageHeight = '';
	}

	if (aspectRatioOverride) {
		desktopAspectRatio = aspectRatioOverride;
		mobileAspectRatio = aspectRatioOverride;
	}

	var breakpointImages = {};

	// Start with Fullscreen Image Size
	// if an override for desktop columns hasn't been defined, or if the grid is preventing overrides, use the grid default
	if (gridSettings.desktopColumns === 'default' || gridData.disableOverrideColumnSpan) {
		gridSettings.desktopColumns = gridData.defaultDesktopColumnSpan;
	}

	// if the grid is set to be fullwidth, we have no way of knowing how big the columns are until the first breakpoint, so we'll just use the fullsized images
	if (gridData.colWidthsAtBreakpoints.fullwidth === "full") {
		var imageURL = urlEncodeSpaces(desktopFile.getImageURL(imageUrlArgs.default).toString());
		breakpointImages.fullwidth = {
			retina: imageURL,
			standard: imageURL,
			width: originalImageWidth,
			height: originalImageHeight,
			aspectRatio: desktopAspectRatio
		};
		// Otherwise, calculate the desktop image (anything larger than the largest defined breakpoint) based on data passed from grid
	} else {
		var fullWidth = calculateImageWidth(gridData.colWidthsAtBreakpoints.fullwidth, gridSettings.desktopColumns, gridData.desktopGap, containerToImageWidthOperations.desktop);

		imageUrlArgs = setImageUrlArgs(imageUrlArgs, fullWidth);

		breakpointImages.fullwidth = {
			retina: urlEncodeSpaces(desktopFile.getImageURL(imageUrlArgs.retina).toString()),
			standard: urlEncodeSpaces(desktopFile.getImageURL(imageUrlArgs.standard).toString()),
			width: fullWidth,
			height: desktopAspectRatio ? Math.ceil(fullWidth * desktopAspectRatio) : '',
			aspectRatio: desktopAspectRatio
		};
	}
	// Now Generate the images for every defined breakpoint
	var breakpointLength = gridData.breakpoints.length;
	for (let i = 0; i < breakpointLength; i++) {
		var breakpoint = gridData.breakpoints[i];
		var colWidth = gridData.colWidthsAtBreakpoints[breakpoint];
		var imageWidth;
		var file = desktopFile;
		var aspectRatio;
		if (breakpoint <= gridData.mobileSwitchBreakpoint) {
			file = mobileFile;
			imageWidth = calculateImageWidth(colWidth, gridSettings.mobileColumns, gridData.mobileGap, containerToImageWidthOperations.mobile[gridSettings.mobile]);
			aspectRatio = mobileAspectRatio;
		} else {
			imageWidth = calculateImageWidth(colWidth, gridSettings.desktopColumns, gridData.desktopGap, containerToImageWidthOperations.desktop);
			aspectRatio = desktopAspectRatio;
		}

		imageUrlArgs = setImageUrlArgs(imageUrlArgs, imageWidth);

		breakpointImages['max' + breakpoint] = {
			retina: urlEncodeSpaces(file.getImageURL(imageUrlArgs.retina).toString()),
			standard: urlEncodeSpaces(file.getImageURL(imageUrlArgs.standard).toString()),
			width: imageWidth,
			height: aspectRatio ? Math.ceil(imageWidth * aspectRatio) : '',
			aspectRatio: aspectRatio
		};
	}
	return breakpointImages;
}

// eslint-disable-next-line valid-jsdoc
/**
 * @function addCustomAttribute
 * @description Add custom attribute to the Component wrapper.
 *
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 *
 */
function addCustomAttribute(context, key, value) {
	var componentRenderSettings = context.componentRenderSettings;
	setAttribute(componentRenderSettings, key, value);
}

// eslint-disable-next-line valid-jsdoc
/**
 * @function overrideComponentTag
 * @description Add custom attribute to the Component wrapper.
 *
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 *
 */
function overrideComponentTag(context, tag) {
	var componentRenderSettings = context.componentRenderSettings;
	componentRenderSettings.setTagName(tag);
}

function createHrefFromLinkObject(linkObject) {
	let href;
	if (linkObject) {
		if (typeof linkObject.value === "object") {
			href = URLUtils.url(linkObject.value[0], linkObject.value[1], linkObject.value[2]);
		} else {
			href = linkObject.value;
		}
	} else {
		href = false;
	}
	return href;
}

/**
 * Parse Render Parameters
 *
 * @param {Object} renderParametersJson The json render parameters
 *
 * @returns {Object} render parameters
 */
function parseRenderParameters(renderParametersJson) {
	var renderParameters = {};
	if (renderParametersJson) {
		try {
			renderParameters = JSON.parse(renderParametersJson);
		} catch (e) {
			var Logger = require('dw/system/Logger');
			Logger.error('Unable to parse renderParameters: ' + renderParametersJson);
		}
	}
	return renderParameters;
}

function determineDecorator(context) {
	var renderParameters = parseRenderParameters(context.renderParameters);
	var decorator;
	var cartridgeDecorator;

	try {
		cartridgeDecorator = require('*/cartridge/experience/defaultdecorator');
	} catch (e) {
		var Logger = require('dw/system/Logger');
		Logger.warn('Unable to determine frontend decorator ' + e);
	}
	// determine decorator
	if (renderParameters.decorator) {
		// overridden on runtime
		decorator = renderParameters.decorator;
	} else if (cartridgeDecorator) {
		// provided by frontend
		decorator = cartridgeDecorator;
	} else {
		// provided by pagedesigner
		decorator = 'decoration/decorator';
	}
	return decorator;
}

base.createDefaultRegionClass = createDefaultRegionClass;
base.createDefaultComponentClass = createDefaultComponentClass;
base.setAttribute = setAttribute;
base.manageLinkFiltersQueries = manageLinkFiltersQueries;
base.addCustomClassOrID = addCustomClassOrID;
base.addCustomAttribute = addCustomAttribute;
base.overrideComponentTag = overrideComponentTag;
base.fieldMapper = fieldMapper;
base.linkCustomEditorHandler = linkCustomEditorHandler;
base.generateResponsiveImageObject = generateResponsiveImageObject;
base.createHrefFromLinkObject = createHrefFromLinkObject;
base.determineDecorator = determineDecorator;

module.exports = base;
