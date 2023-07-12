function encodeQuotes(string) {
	if (typeof string !== "string") {
		return;
	}
	return string.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getFieldValue(fieldSettings) {
	var value = "";
	if (fieldSettings.value) {
		value = fieldSettings.value;
	} else if (fieldSettings.default) {
		value = fieldSettings.default;
	}
	if (typeof value === "string") {
		value = encodeQuotes(value);
	}
	return value;
}

function arrayMove(arr, old_index, new_index) {
	while (old_index < 0) {
		old_index += arr.length;
	}
	while (new_index < 0) {
		new_index += arr.length;
	}
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return;
};

function getUniqueID(id, fieldSettings) {
	var label = fieldSettings.label.replace(/\s/g, '');
	var uniqueID = id + label;
	return uniqueID;
}

function buildText(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var placeholder = fieldSettings.placeholder ? fieldSettings.placeholder : '';
	return inputHTML = `
		<label class="slds-form-element__label slds-p-top_none" for="${id}">${fieldSettings.label}</label>
		<div class="slds-form-element__control">
			<input
				class="slds-input setting"
				type="text"
				placeholder="${placeholder}"
				name="${id}"
				id="${id}"
				value="${value}"
			/>
		</div>
	`;
}

function buildNumber(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var placeholder = fieldSettings.placeholder ? fieldSettings.placeholder : '';
	return inputHTML = `
		<label class="slds-form-element__label slds-p-top_none" for="${id}">${fieldSettings.label}</label>
		<div class="slds-form-element__control">
			<input
				class="slds-input setting"
				type="number"
				placeholder="${placeholder}"
				name="${id}"
				id="${id}"
				value="${value}"
			/>
		</div>
	`;
}

function buildTextarea(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var placeholder = fieldSettings.placeholder ? fieldSettings.placeholder : '';
	return inputHTML = `
		<label class="slds-form-element__label slds-p-top_none" for="${id}">${fieldSettings.label}</label>
		<div class="slds-form-element__control">
			<textarea
				placeholder="${placeholder}"
				class="slds-textarea setting"
				name="${id}"
				id="${id}"
			>${value}</textarea>
		</div>
	`;
}

function buildSelect(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var inputHTML = `
		<label class="slds-form-element__label slds-p-top_none" for="${id}">${fieldSettings.label}</label>
		<div class="slds-form-element__control"><div class="slds-select_container">
			<select
				class="slds-select setting"
				name="${id}"
				id="${id}"
			>
	`;
	var length = fieldSettings.options.length;
	for (var i = 0; i < length; i++) {
		var option = fieldSettings.options[i];
		var conditional = "";
		if (option.hasOwnProperty('conditional')) {
			conditional = `
				disabled="disabled"
				data-trigger="${option.conditional[0]}"
				data-trigger-value='${JSON.stringify(option.conditional[1])}'
			`;
		}


		if (option.id == value) {
			inputHTML += `<option value="${option.id}" selected="selected" ${conditional}>${option.label}</option>`
		} else {
			inputHTML += `<option value="${option.id}" ${conditional}>${option.label}</option>`
		}
	}
	inputHTML += `</select></div></div>`;
	return inputHTML;
}

function buildRadio(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var inputHTML = `
		<fieldset class="slds-form-element">
			<legend class="slds-form-element__legend slds-form-element__label">${fieldSettings.label}</legend>
				<div class="slds-form-element__control">
					<div class="slds-radio_button-group">`;
	var length = fieldSettings.options.length;
	for (var i = 0; i < length; i++) {
		var option = fieldSettings.options[i];
		var uniqueID = getUniqueID(option.id, fieldSettings);
		inputHTML += `
			<span class="slds-button slds-radio_button">
				<input
					type="radio"
					name="${id}"
					id="${uniqueID}"
					value="${option.id}"
					class="setting"
					${option.id === value ? 'checked="checked"' : ''}
				>
				<label class="slds-radio_button__label" for="${uniqueID}">
					<span class="slds-radio_faux">${option.label}</span>
				</label>
			</span>
		`;
	}
	inputHTML += '</div></div></fieldset>';
	return inputHTML;
}

function buildCheckbox(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);

	var inputHTML = `
		<div class="slds-form-element">
			<div class="slds-form-element__control">
				<div class="slds-checkbox">
					<input type="checkbox" class="setting" name="${id}" id="${id}" ${value ? 'checked="checked"' : ''}/>
					<label class="slds-checkbox__label" for="${id}">
						<span class="slds-checkbox_faux"></span>
						<span class="slds-form-element__label">${fieldSettings.label}</span>
					</label>
				</div>
			</div>
		</div>
	`;

	return inputHTML;
}

function buildInstructions(id, fieldSettings) {
	return fieldSettings.default;
}

function buildSpacing(id, fieldSettings) {
	var inputHTML = `
		<div class="slds-form-element">
			<div class="slds-form-element__control">
				<button
					type="button"
					id="${id}"
					class="slds-button slds-button_stretch slds-button_outline-brand breakout"
					data-type="spacingBreakout"
					data-settings='${JSON.stringify(fieldSettings)}'
					>Define Margins/Paddings</button>
			</div>
		</div>
	`;
	return inputHTML;
}

function buildHidden(id, value) {
	var encodedValue = value;
	if (typeof encodedValue === 'string') {
		encodedValue = encodeQuotes(encodedValue);
	}
	var inputHTML = `
		<input
			type="hidden"
			id="${id}"
			name="${id}"
			value="${encodedValue}"
		/>`
	return inputHTML;
}

function buildRaw(id, fieldSettings, rawId, rawFieldSettings) {
	var value = getFieldValue(rawFieldSettings);

	return inputHTML = `
		<label class="slds-form-element__label slds-p-top_none" for="${id}">${fieldSettings.label}</label>
		<div class="slds-form-element__control">
			<textarea
				class="slds-textarea raw"
				name="${id}"
				id="${id}"
				data-raw-id="${rawId}"
				disabled="disabled"
			>${JSON.stringify(value)}</textarea>
		</div>
	`;
}

function buildAddAnother(id, fieldSettings) {
	var value = getFieldValue(fieldSettings);
	var addedItems = '';
	var valueLength = 0;
	var addAnotherText = "Add";
	if (value) {
		var iconURL = newHelpers.config.iconURL;
		valueLength = value.length;
		if (valueLength > 0) {
			addAnotherText = "Add Another";
		}
		for (i = 0; i < valueLength; i++) {
			var item = value[i];
			var displayNameField = fieldSettings.displayNameField ? fieldSettings.displayNameField : 'displayName';
			displayname = encodeQuotes(item[displayNameField]);
			addedItems += `<div class="slds-m-bottom_x-small createdElement" data-position="${i}">
				<div class="slds-grid slds-grid_vertical-align-start">
					<div class="slds-col slds-grow">
						<button
							class="slds-button slds-button_brand slds-button_stretch breakout addAnother"
							id="${id}-${i}"
							data-type="${fieldSettings.breakoutEditor}"
							data-settings='${encodeQuotes(JSON.stringify(fieldSettings))}'
						>
							${displayname}
							<svg class="slds-button__icon slds-button__icon_right" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#settings"></use></svg>
						</button>
					</div>
					<div class="slds-col slds-grow-none slds-m-left_xx-small">
						<div class="slds-button-group" role="group">
							<button type="button" class="slds-button slds-button_neutral upButton" data-item="${id}-${i}"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowup"></use></svg></button>
							<button type="button" class="slds-button slds-button_neutral downButton" data-item="${id}-${i}"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowdown"></use></svg></button>
							<button type="button" class="slds-button slds-button_destructive removeButton" data-item="${id}-${i}"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#close"></use></svg></button>
						</div>
					</div>
				</div>
			</div>`;
		}
	}
	if (fieldSettings.hasOwnProperty('addAnotherText')) {
		addAnotherText = fieldSettings.addAnotherText;
	}
	var buttonText = addAnotherText + ' ' + fieldSettings.label;

	var buttonDisabled = false;
	if (fieldSettings.hasOwnProperty('itemLimit')) {
		buttonText += ` (${valueLength} of ${fieldSettings.itemLimit})`;
		if (valueLength >= fieldSettings.itemLimit) {
			buttonDisabled = true;
		}
	}

	var inputHTML = `
		<div class="slds-box slds-box_x-small" id="${id}Holder">
			<div class="addedItems">
				${addedItems}
			</div>
			<button
				type="button"
				id="${id}"
				data-type="${fieldSettings.breakoutEditor}"
				data-settings='${encodeQuotes(JSON.stringify(fieldSettings))}'
				class="slds-button slds-button_stretch slds-button_brand breakout addAnother"
				${buttonDisabled ? 'disabled="disabled"' : ''}
				>${buttonText}</button>
		</div>
	`;

	return inputHTML;
}

function buildFocalGrid(id, fieldSettings) {
    var value = getFieldValue(fieldSettings);
    var showFocalPoint = newHelpers.config.showFocalPoint;
    var inputHTML = '';
    if (showFocalPoint !== false) {
        inputHTML += `
			<fieldset class="slds-form-element">
				<legend class="slds-form-element__label slds-form-element__legend slds-p-top_none">${fieldSettings.label}</legend>
				<div class="slds-form-element__control new-nine-grid">
		`;
        var length = fieldSettings.options.length;
        for (var i = 0; i < length; i++) {
            var option = fieldSettings.options[i];
            inputHTML += `
					<span class="slds-radio grid-coordinate ${option.id}">
						<input type="radio" name="${id}" id="${option.id}"
							class="setting"
							value="${option.value}" 
							${option.value === value ? 'checked' : ''}
						/>
						<label class="slds-radio__label" for="${option.id}">
							<span class="slds-radio_faux">${option.label}</span>
						</label>
					</span>
			`;
        }
        inputHTML += `
				</div>
			</fieldset>
		`;
    }
    return inputHTML;
}

function buildSlider(id, fieldSettings) {
    var value = getFieldValue(fieldSettings);
    var showQualityRange = newHelpers.config.showQualityRange;
    var inputHTML = '';
    if (showQualityRange !== false) {
        inputHTML += `
			<fieldset class="slds-form-element">
				<legend class="slds-form-element__label slds-form-element__legend slds-p-top_none" for="${id}">${fieldSettings.label}</legend>
				<span class="slds-slider-label__range slds-m-left-small">min - max values: ${fieldSettings.min} - ${fieldSettings.max}</span>
				<div class="slds-form-element__control new-slider">
					<div class="slds-form-element__control">
						<div class="slds-slider">
						<input type="range" name="${id}" id="${id}" class="rangeSlider slds-slider__range" min="${fieldSettings.min}" max="${fieldSettings.max}" value="${value}" />
						<span class="slds-slider__value" aria-hidden="true">${value}</span>
						</div>
					</div>
				</div>
			</fieldset>
		`;
    }
    return inputHTML;
}

function buildSFCCLink(id, fieldSettings) {
	var iconURL = newHelpers.config.iconURL;
	var valueString = "";
	if (fieldSettings.value) {
		if (Array.isArray(fieldSettings.value.value)) {
			valueString = ": " + fieldSettings.value.value[2];
		} else {
			valueString = ": " + fieldSettings.value.value;
		}
	}
	var buttonStyle = fieldSettings.buttonStyle ? fieldSettings.buttonStyle : 'outline-brand';
	var inputHTML = `
		<div class="slds-grid slds-grid_vertical-align-start">
			<div class="slds-col slds-grow">
				<button
					type="button"
					id="${id}"
					class="slds-button slds-button_stretch slds-button_${buttonStyle} breakout"
					data-type="sfcc:linkBuilder"
					data-label="${fieldSettings.label}"
					data-settings='${JSON.stringify(fieldSettings)}'
					>${fieldSettings.label} ${valueString}</button>
			</div>
			<div class="slds-col slds-grow-none slds-m-left_xx-small">
				<button type="button" class="slds-button slds-button_destructive clearFieldButton" data-id="${id}"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#close"></use></svg></button>
			</div>
		</div>
	`;
	return inputHTML;
}

function buildSFCCProduct(id, fieldSettings) {
	var iconURL = newHelpers.config.iconURL;
	var valueString = "";
	if (fieldSettings.value) {
		if (Array.isArray(fieldSettings.value.value)) {
			valueString = ": " + fieldSettings.value.value[2];
		} else {
			valueString = ": " + fieldSettings.value.value;
		}
	}
	var buttonStyle = fieldSettings.buttonStyle ? fieldSettings.buttonStyle : 'outline-brand';
	var inputHTML = `
		<div class="slds-grid slds-grid_vertical-align-start">
			<div class="slds-col slds-grow">
				<button
					type="button"
					id="${id}"
					class="slds-button slds-button_stretch slds-button_${buttonStyle} breakout"
					data-type="sfcc:productPicker"
					data-label="${fieldSettings.label}"
					data-settings='${JSON.stringify(fieldSettings)}'
					>${fieldSettings.label} ${valueString}</button>
			</div>
			<div class="slds-col slds-grow-none slds-m-left_xx-small">
			<button type="button" class="slds-button slds-button_destructive clearFieldButton" data-id="${id}"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#close"></use></svg></button>
			</div>
		</div>
	`;
	return inputHTML;
}

function buildBreadcrumbs() {
	var inputHTML = `
	<div class="breadcrumbs"></div>
	`;
	return inputHTML;
}

function buildError(id, fieldSettings) {
	return `<div class="slds-box slds-box_xx-small slds-theme_error">Sorry, the field <strong>"${id}"</strong> has an undefined field type: <strong>"${fieldSettings.type}"</strong></div>`;
}

function buildAlignButtons(id, fieldSettings) {
    var value = getFieldValue(fieldSettings);
    var inputHTML = `
		<fieldset class="slds-form-element">
			<legend class="slds-form-element__label slds-form-element__legend slds-p-top_none">${fieldSettings.label}</legend>
			<div class="slds-form-element__control new-align-buttons">
	`;
    var length = fieldSettings.options.length;
    for (var i = 0; i < length; i++) {
        var option = fieldSettings.options[i];
        var iconURL = newHelpers.config.iconURL;
        inputHTML += `
			<span class="slds-button slds-radio_button slds-button_icon">
				<input
					type="radio"
					name="${id}"
					id="${id + '-' + option.id}"
					class="setting"
					value="${option.id}"
					${option.id === value ? 'checked="checked"' : ''}
				>
				<label class="slds-radio_button__label slds-button_neutral" for="${id + '-' + option.id}">
					<svg class="slds-button__icon" aria-hidden="true">
						<use xlink:href="${iconURL}symbols-utility.svg#${option.id}_align_text"></use>
					</svg>
					<span class="slds-assistive-text">${option.label}</span>
				</label>
			</span>
		`;
    }
    inputHTML += `
			</div>
		</fieldset>
	`;
    return inputHTML;
}

newHelpers = {
	fields: {},
	settings: {},
	config: {},
	parseSelects: (selects, payload) => {
		selects.forEach((select) => {
			let id = $(select).attr('id');
			$(select).val(payload[id]);
		});
	},

	mapComponentDefaults: (payload, defaults) => {
		Object.keys(defaults).forEach(function (setting) {
			if (payload.hasOwnProperty(setting)) {
				payload[setting] = defaults[setting];
			}
		});
		return payload;
	},

	init: (value, editorDefinition, config, parent) => {
        var fields = editorDefinition.fields;
        var settings = {};
        if (editorDefinition.hasOwnProperty('settings')) {
            settings = editorDefinition.settings;
        }
        if (config) {
            newHelpers.config = config;
        }
        if (parent) {
            var parentReferenceHTML = newHelpers.buildParentReference(parent);
            $('body').append(parentReferenceHTML);
        }
        var componentDefinedHidden = editorDefinition.componentDefinedHidden;
        var componentDefinedDefaults = editorDefinition.componentDefinedDefaults;

        // update the JSON Definition with any previously saved data
        if (value) {
            for (id in fields) {
                if (value.hasOwnProperty(id)) {
                    fields[id].value = value[id];
                }
            }
        }

        // Emit after init to prevent issues with updates not saving unless a field is changed.
        newHelpers.prepEmit(fields, settings);

        // Build interface from JSON Definition
        var interfaceHTML = newHelpers.buildInterface(fields, settings, componentDefinedDefaults, componentDefinedHidden);
        $('body').append(interfaceHTML);

        // Announce that the interface has been built and is ready
        $(document).trigger('built');

        // When a setting change is announced (see pxgInterface.js for the trigger), update the value in the JSON Definition.
        // This specifically helps with checkboxes and radio buttons
        $(document).on('settingChange', function (e, id, val) {
            fields[id].value = val;
            newHelpers.prepEmit(fields, settings);
        });

        $(document).on('breakoutOpen', function (e, type, settings, id, addAnother) {
            newHelpers.handleBreakoutOpen(type, settings, id, addAnother);
        });

        $(document).on('addAnotherRemove', function (e, id) {
            newHelpers.handleBreakoutRemove(id);
        });

        $(document).on('addAnotherMoveUp', function (e, id) {
            newHelpers.handleBreakoutMove(id, 'up');
        });

        $(document).on('addAnotherMoveDown', function (e, id) {
            newHelpers.handleBreakoutMove(id, 'down');
        });

        $(document).on('clearField', function (e, id) {
            newHelpers.clearField(id);
        });
    },

	buildInterface: (fields, settings, defaults, hidden) => {
		// Create a bounding box
		var interfaceHTML = '<div class="ce slds-box slds-box_xx-small slds-theme_shade new-custom-editor">';

		// Create a box for advanced options
		var advancedInterfaceHTML = '<div class="ce-advanced">';

		var hasAdvanced = false;

		for (var id of Object.keys(fields)) {
			var field = fields[id];
			//Skip fields that were hidden on the component level
			if (hidden.includes(id)) {
				continue;
			}

			//If this field has been deprecated, don't display it.
			if (field.deprecated) {
				continue;
			}

			// Fill in defaults that were set on the component level
			if (defaults.hasOwnProperty(id)) {
				field.default = defaults[id];
			}

			if (field.type === "checkbox" && !field.hasOwnProperty('default')) {
				field.default = false;
			}

			if (field.type === 'focalGrid' && !field.hasOwnProperty('default')) {
                field.default = false;
            }

			// Build HTML
			var fieldHTML;
			switch (field.type) {
                case 'text':
                    fieldHTML = buildText(id, field);
                    break;
                case 'number':
                    fieldHTML = buildNumber(id, field);
                    break;
                case 'textarea':
                    fieldHTML = buildTextarea(id, field);
                    break;
                case 'select':
                    fieldHTML = buildSelect(id, field);
                    break;
                case 'radio':
                    fieldHTML = buildRadio(id, field);
                    break;
                case 'focalGrid':
                    fieldHTML = buildFocalGrid(id, field);
                    break;
                case 'slider':
                    fieldHTML = buildSlider(id, field);
                    break;
                case 'checkbox':
                    fieldHTML = buildCheckbox(id, field);
                    break;
                case 'instructions':
                    fieldHTML = buildInstructions(id, field);
                    break;
                case 'spacing':
                    fieldHTML = buildSpacing(id, field);
                    break;
                case 'raw':
                    var rawField = fields[field.rawField];
                    fieldHTML = buildRaw(id, field, field.rawField, rawField);
                    break;
                case 'addAnother':
                    fieldHTML = buildAddAnother(id, field);
                    break;
                case 'SFCCLink':
                    fieldHTML = buildSFCCLink(id, field);
                    break;
                case 'SFCCProduct':
                    fieldHTML = buildSFCCProduct(id, field);
                    break;
                case 'breadcrumbs':
                    fieldHTML = buildBreadcrumbs();
                    break;
                case 'alignButtons':
                    fieldHTML = buildAlignButtons(id, field);
                    break;
                default:
                    fieldHTML = buildError(id, field);
            }
			var classes = [];
			if (field.newRow) {
				classes.push("new-row");
			}
			if (field.width) {
				classes.push(field.width);
			}

			var conditional = "";
			if (field.hasOwnProperty('conditional')) {
				conditional = `
					data-trigger="${field.conditional[0]}"
					data-trigger-value='${JSON.stringify(field.conditional[1])}'
				`;
				classes.push('conditionally-hidden');
			}

			fieldHTML = `<div class="slds-form-element ce-input ${classes.join(' ')}" ${conditional}>${fieldHTML}</div>`;

			if (field.advanced) {
				advancedInterfaceHTML += fieldHTML;
				hasAdvanced = true;
			} else {
				interfaceHTML += fieldHTML;
			}
			firstLoop = false;
		};
		if (hasAdvanced) {
			var buttonShowText = settings.advancedButtonShowText ? settings.advancedButtonShowText : 'Show Advanced Options';
			var buttonHideText = settings.advancedButtonHideText ? settings.advancedButtonHideText : 'Hide Advanced Options';
			interfaceHTML += `<div class="full advanced-button"><button id="advanced" data-show-text="${buttonShowText}" data-hide-text="${buttonHideText}">${buttonShowText}</button></div>`
			interfaceHTML += advancedInterfaceHTML + "</div>"; // close advanced Interface div
		}
		interfaceHTML += "</div>"; // close interface div
		return interfaceHTML;
	},

	buildParentReference: (fields) => {
		// Create a bounding box
		var parentReferenceHTML = '<div class="parentReferenceFields">';

		for (var id of Object.keys(fields)) {
			var field = fields[id];
			var fieldHTML = buildHidden('parent' + id, field);
			parentReferenceHTML += fieldHTML;
		};

		parentReferenceHTML += "</div>"; // close interface div
		return parentReferenceHTML;
	},

	prepEmit: (fields, settings) => {
		var version = settings.hasOwnProperty('version') ? settings.version : 1;
		var name = settings.hasOwnProperty('name') ? settings.name : 'customEditor';
		var payload = {
			version: version,
			versionName: name + '-v' + version
		};
		if (settings.hasOwnProperty('breakoutFieldID')) {
			payload.breakoutFieldID = settings.breakoutFieldID;
		}
		for (var id of Object.keys(fields)) {
			var field = fields[id];

			//if the field has been deprecated don't save its data, a migration should run to move the data appropriately.
			if (field.deprecated) {
				continue;
			}

			var value = null;
			if (field.hasOwnProperty('value')) {
				value = field.value;
			} else if (field.hasOwnProperty('default')) {
				value = field.default;
			}

			payload[id] = value;
		}
		newHelpers.fields = fields;
		newHelpers.settings = settings;
		emit({
			type: 'sfcc:value',
			payload: payload
		});
	},

	handleBreakoutOpen: (type, settings, id, addAnother) => {
		var closeHandler = newHelpers.handleBreakoutClose;
		if (addAnother) {
			closeHandler = newHelpers.handleAddAnotherClose;
		}
		newHelpers.settings.breakoutFieldID = id;
		newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);
		emit({
			type: 'sfcc:breakout',
			payload: {
				id: type,
				title: settings.label
			}
		}, closeHandler);
	},

	handleBreakoutClose: ({ type, value }) => {
		if (type === 'sfcc:breakoutApply') {
			newHelpers.handleBreakoutApply(value);
		} else {
			newHelpers.handleBreakoutCancel();
		}
	},

	handleAddAnotherClose: ({ type, value }) => {
		if (type === 'sfcc:breakoutApply') {
			newHelpers.handleAddAnotherApply(value);
		} else {
			newHelpers.handleBreakoutCancel();
		}
	},

	handleBreakoutCancel: () => {
		$(document).trigger('breakoutClose');
	},

	handleBreakoutApply: (response) => {
		if (newHelpers.settings.breakoutFieldID) {
			var breakoutFieldID = newHelpers.settings.breakoutFieldID;
			newHelpers.fields[breakoutFieldID].value = response;
			delete newHelpers.settings.breakoutFieldID
			newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);
		}
		if (response.type === "sfcc:linkBuilder") {
			var $breakoutHolder = $('#' + breakoutFieldID).closest('.slds-form-element');
			$breakoutHolder.html(buildSFCCLink(breakoutFieldID, newHelpers.fields[breakoutFieldID]));
		} else if (response.type === "sfcc:productPicker") {
			var $breakoutHolder = $('#' + breakoutFieldID).closest('.slds-form-element');
			$breakoutHolder.html(buildSFCCProduct(breakoutFieldID, newHelpers.fields[breakoutFieldID]));
		}

		$(document).trigger('breakoutClose');
	},

	handleAddAnotherApply: (response) => {
		if (newHelpers.settings.breakoutFieldID) {
			var breakoutFieldID = newHelpers.settings.breakoutFieldID;
			if (breakoutFieldID.includes("-")) {
				// if the ID contains a hypen, then the id is designating a field and an array index of that field, meaning we are editing a previously saved editor
				var addAnotherIDArray = breakoutFieldID.split('-');
				breakoutFieldID = addAnotherIDArray[0];
				var valueID = addAnotherIDArray[1];
				newHelpers.fields[breakoutFieldID].value[valueID] = response;
			} else {
				// Otherwise we are just adding a new value.
				if (newHelpers.fields[breakoutFieldID].value) {
					// If the value has been set, push the new value to the end of the array;
					newHelpers.fields[breakoutFieldID].value.push(response);
				} else {
					// Otherwise create it and set first value as the response.
					newHelpers.fields[breakoutFieldID].value = [response];
				}
			}
			delete newHelpers.settings.breakoutFieldID
			newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);
		}

		//rebuild the add another div with updates
		var $addAnotherHolder = $('#' + breakoutFieldID + "Holder").parent();
		$addAnotherHolder.html(buildAddAnother(breakoutFieldID, newHelpers.fields[breakoutFieldID]));
		$(document).trigger('breakoutClose');
	},

	clearField: (fieldID) => {
		newHelpers.fields[fieldID].value = '';
		newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);
		const label = $("#" + fieldID).data('label');
		$("#" + fieldID).html(label);
	},

	handleBreakoutRemove: (id) => {
		var idArray = id.split('-');
		var fieldID = idArray[0];
		var itemID = idArray[1];

		var fieldValues = newHelpers.fields[fieldID].value;
		fieldValues.splice(itemID, 1);
		newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);

		var $addAnotherHolder = $('#' + fieldID + "Holder").parent();
		$addAnotherHolder.html(buildAddAnother(fieldID, newHelpers.fields[fieldID]));
	},

	handleBreakoutMove: (id, direction) => {
		var idArray = id.split('-');
		var fieldID = idArray[0];
		var fieldValues = newHelpers.fields[fieldID].value;
		var currentPosition = idArray[1];
		var newPosition = currentPosition;

		if (direction === "down") {
			newPosition++;
		} else {
			newPosition--;
		}

		if (newPosition > fieldValues.length - 1 || newPosition < 0) {
			//already at the limit, so just exit
			return;
		}

		arrayMove(fieldValues, currentPosition, newPosition);

		newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);
		var $addAnotherHolder = $('#' + fieldID + "Holder").parent();
		$addAnotherHolder.html(buildAddAnother(fieldID, newHelpers.fields[fieldID]));
	},

	handleBreakoutMoveUp: (id) => {
		var idArray = id.split('-');
		var fieldID = idArray[0];
		var itemID = idArray[1];

		var fieldValues = newHelpers.fields[fieldID].value;
		fieldValues.splice(itemID, 1);
		newHelpers.prepEmit(newHelpers.fields, newHelpers.settings);

		var $addAnotherHolder = $('#' + fieldID + "Holder").parent();
		$addAnotherHolder.html(buildAddAnother(fieldID, newHelpers.fields[fieldID]));
	}
};
