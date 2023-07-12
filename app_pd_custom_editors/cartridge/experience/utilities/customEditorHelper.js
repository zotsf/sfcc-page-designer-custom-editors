/* eslint-disable valid-jsdoc */

'use strict';

var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

var handlers = {};

function spacing(ce) {
	var spacingClassArray = [];
	var ceIterator = ce.keySet().iterator();
	while (ceIterator.hasNext()) {
		var setting = ceIterator.next();
		if (ce[setting].value !== 'default') {
			spacingClassArray.push(setting + '-' + ce[setting].value);
		}
	}

	ce.classes = spacingClassArray.join(' ');
	return ce;
}

function header(ce) {
	var classesArray = [
		ce.tagClass,
		ce.headerFont,
		ce.userDefinedClasses
	];

	var containerClassesArray = [
		ce.alignment,
		ce.alignmentDesktop
	];

	/* Begin Migration

		Can be reduced to just:

			var calculatedSpacing = spacing(ce.spacing);
			var spacingClasses = ' ' + calculatedSpacing.classes;

		Once the migration to version 3 is complete on all existing components implementing the header
	*/
	var spacingClasses = "";
	if (ce.version >= 3) {
		var calculatedSpacing = spacing(ce.spacing);
		spacingClasses = ' ' + calculatedSpacing.classes;
	} else {
		containerClassesArray.push('pt-' + ce.paddingTop);
		containerClassesArray.push('pb-' + ce.paddingBottom);
	}
	/* End Migration */

	/* Begin Migration

		Can be reduced to just:
			classesArray.push('theme-override-' + ce.tagColor);

		Once the migration to version 4 is complete on all existing components implementing the header
	*/
	if (ce.version >= 4) {
		classesArray.push('theme-override-' + ce.tagColor);
	} else {
		classesArray.push(ce.tagColor);
	}
	/* End Migration */

	ce.classes = classesArray.join(' ');
	ce.containerClasses = containerClassesArray.join(' ') + spacingClasses;
	ce.headerIDAttr = ce.headerID && ce.headerID !== '' ? ' id="' + ce.headerID + '"' : '';

	return ce;
}

function hotspots(ce) {
	var classesArray = [];

	// Generate Layout Classes
	if (ce.componentLayout === "oneImage") {
		classesArray.push('one-image');
	} else if (ce.componentLayout === "imageText") {
		classesArray.push('image-text');
	} else if (ce.componentLayout === "textImage") {
		classesArray.push('image-text');
		classesArray.push('reverse');
	} else if (ce.componentLayout === "imageTextOverImage") {
		classesArray.push('image-text');
		classesArray.push('lower-image');
	} else if (ce.componentLayout === "textImageOverImage") {
		classesArray.push('image-text');
		classesArray.push('lower-image');
		classesArray.push('reverse');
	}

	// Generate Action Classes
	if (ce.hotspotBehavior === "popText") {
		classesArray.push('action-pop');
	} else if (ce.hotspotBehavior === "popProduct") {
		classesArray.push('action-pop');
	} else if (ce.hotspotBehavior === "swapText") {
		classesArray.push('action-swap-text');
	} else if (ce.hotspotBehavior === "swapImage") {
		classesArray.push('action-swap-image');
	} else if (ce.hotspotBehavior === "swapTextAndImage") {
		classesArray.push('action-swap-text');
		classesArray.push('action-swap-image');
	} else if (ce.hotspotBehavior === "swapThisImage") {
		classesArray.push('action-swap-this-image');
	} else if (ce.hotspotBehavior === "directLink") {
		classesArray.push('action-direct-link');
	}

	// Generate style classes
	classesArray.push('hotspot_' + ce.hotspotColor);
	classesArray.push('hotspot-active_' + ce.hotspotActiveColor);
	classesArray.push('popup-color_' + ce.popupBackgroundColor);
	if ((ce.popupBackgroundColor === 'match' || ce.popupBackgroundColor === 'custom') && ce.popupTextColor) {
		classesArray.push('popup-text_' + ce.popupTextColor);
	}

	ce.classesArray = classesArray;
	ce.classes = classesArray.join(' ');

	var stylesArray = [];
	if (ce.hotspotColor === "custom") {
		stylesArray.push('--_hotspotColorCustom: ' + ce.hotspotColorCustom + ';');
	}
	if (ce.hotspotActiveColor === "custom") {
		stylesArray.push('--_hotspotActiveColorCustom: ' + ce.hotspotActiveColorCustom + ';');
	}
	if (ce.popupBackgroundColor === "custom") {
		stylesArray.push('--_popupBackgroundColorCustom: ' + ce.popupBackgroundColorCustom + ';');
	}
	if (ce.popupTextColor === "custom") {
		stylesArray.push('--_popupTextColorCustom: ' + ce.popupTextColorCustom + ';');
	}

	ce.stylesArray = stylesArray;
	ce.styles = stylesArray.join(' ');

	var numberOfHotspots = ce.hotspots.length;
	for (var i = 0; i < numberOfHotspots; i++) {
		var hotspot = ce.hotspots[i];
		var hotspotClassArray = [];
		var hotspotStyleArray = [];

		hotspotStyleArray.push('--_top: ' + hotspot.y + '%;');
		hotspotStyleArray.push('--_left: ' + hotspot.x + '%;');

		if (PageRenderHelper.isInEditMode()) {
			hotspotStyleArray.push('--_name: "(' + hotspot.displayName + ')";');
		}

		if (hotspot.x < 50) {
			hotspotClassArray.push('pop-right');
		} else {
			hotspotClassArray.push('pop-left');
		}


		if (ce.hotspotBehavior === 'directLink') {
			var mappedLinkBuilder = {
				linksArray: hotspot.linkBuilder
			};
			hotspot.linkBuilder = mappedLinkBuilder;
			hotspot.linkBuilder = PageRenderHelper.linkCustomEditorHandler(hotspot.linkBuilder);
			if (hotspot.linkBuilder && hotspot.linkBuilder.linksArray && hotspot.linkBuilder.linksArray.length) {
				hotspot.link = hotspot.linkBuilder.linksArray[0]; // Field is limited to one value
			}
		}

		if (ce.hotspotColor === 'transparent' || hotspot.uniqueHotspotColor === 'transparent') {
			if (hotspot.width) {
				hotspotStyleArray.push('--_width: ' + hotspot.width + '%;');
			}
			if (hotspot.height) {
				hotspotStyleArray.push('--_height: ' + hotspot.height + '%;');
			}
		}

		if (hotspot.uniqueHotspotColor) hotspotClassArray.push('hotspot_' + hotspot.uniqueHotspotColor);
		if (hotspot.uniqueHotspotColor === 'custom' && hotspot.uniqueHotspotColorCustom) hotspotStyleArray.push('--_hotspotColorCustom: ' + hotspot.uniqueHotspotColorCustom + ';');

		if (hotspot.uniqueHotspotActiveColor) hotspotClassArray.push('hotspot-active_' + hotspot.uniqueHotspotActiveColor);
		if (hotspot.uniqueHotspotActiveColor === 'custom' && hotspot.uniqueHotspotActiveColorCustom) hotspotStyleArray.push('--_hotspotActiveColorCustom: ' + hotspot.uniqueHotspotActiveColorCustom + ';');

		if (hotspot.uniquePopupBackgroundColor) hotspotClassArray.push('popup-color_' + hotspot.uniquePopupBackgroundColor);
		if (hotspot.uniquePopupBackgroundColor === 'custom' && hotspot.uniquePopupBackgroundColorCustom) hotspotStyleArray.push('--_popupBackgroundColorCustom: ' + hotspot.uniquePopupBackgroundColorCustom + ';');

		if (hotspot.uniquePopupTextColor) hotspotClassArray.push('popup-text_' + hotspot.uniquePopupTextColor);
		if (hotspot.uniquePopupTextColor === 'custom' && hotspot.uniquePopupTextColorCustom) hotspotStyleArray.push('--_popupTextColorCustom: ' + hotspot.uniquePopupTextColorCustom + ';');

		hotspot.classes = hotspotClassArray.join(' ');
		hotspot.styles = hotspotStyleArray.join(' ');
	}
	return ce;
}

function defaultSettings(ce) {
	var allDefaultClassesArray = [];
	if (ce.showMarginX !== false) {
		allDefaultClassesArray.push('ml-' + ce.marginL);
		allDefaultClassesArray.push(' mr-' + ce.marginR);
	}
	if (ce.showMarginY !== false) {
		allDefaultClassesArray.push('mt-' + ce.marginT);
		allDefaultClassesArray.push('mb-' + ce.marginB);
	}
	if (ce.showPaddingX !== false) {
		allDefaultClassesArray.push('pl-' + ce.paddingL);
		allDefaultClassesArray.push('pr-' + ce.paddingR);
	}
	if (ce.showPaddingY !== false) {
		allDefaultClassesArray.push('pt-' + ce.paddingT);
		allDefaultClassesArray.push('pb-' + ce.paddingB);
		allDefaultClassesArray.push(ce.paddingYClasses);
	}
	if (ce.showTheme !== false) {
		allDefaultClassesArray.push('bg-' + ce.themeColor);
	}
	if (ce.showColor !== false) {
		/*	Begin Migration
			Once migration to v2 is complete this can be reduced to just:

			allDefaultClassesArray.push('theme-override-color_' + ce.color);
		*/
		if (ce.version && ce.version >= 2) {
			allDefaultClassesArray.push('theme-override-color_' + ce.color);
		} else {
			allDefaultClassesArray.push('color_' + ce.color);
		}
		/*	End Migration */
	}
	if (ce.showClass !== false) {
		allDefaultClassesArray.push(ce.additionalClasses);
	}

	ce.allDefaultClasses = allDefaultClassesArray.join(' ');
	return ce;
}



handlers.header = header;
handlers.spacing = spacing;
handlers.hotspots = hotspots;
handlers.defaultSettings = defaultSettings;

module.exports = handlers;
