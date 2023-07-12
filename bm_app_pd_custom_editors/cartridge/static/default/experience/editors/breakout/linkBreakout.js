(() => {
	let $buttonEl;

	let settingsObject = {
        displayName: 'Configured Link',
        linkBuilder: null,
        text: null,
        style: 'btn-primary',
        buttonWidth: 'w-100',
        buttonAlign: '',
        showLinkArrow: '',
        ariaLabel: null,
        linkQueryString: '',
        linkValue: null,
        linkIsArray: false,
        classes: ''
    };

	let coreHTML = `
	<div id="settings" class="slds-m-horizontal_small">
		<div class="inputRow">
			<label class="slds-form-element__label">Administrative Name</label>
			<input type="input" class="formField slds-input" name="displayName">
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label">Link</label>
			<div class="slds-grid slds-grid_vertical-align-start">
				<div class="slds-col slds-grow">
					<input type="input" class="slds-input" disabled name="linkID">
				</div>
				<div class="slds-col slds-grow-none">
					<button id="linkBreakout" class="slds-button slds-button_neutral">Create</button>
				</div>
			</div>
		</div>
		<div class="productOnly inputRow" style="display:none;">
			<button class="slds-button slds-button_neutral" id="showConfigurator">Show Club Configurator Settings</button>
		</div>
		<div class="slds-box slds-theme_shade inputRow" id="configurator" style="display:none;">
			<h2 class="slds-text-heading_small slds-p-bottom_small">Configurator Choices</h2>
			<p class="slds-p-bottom_small">These settings will override the default selections for the club.</p>
			<p class="slds-p-bottom_small">If a field is noted as (SKU), please provide the valid product SKU for that setting, otherwise provide a valid value for the setting.</p>
			<div id="configFields"></div>
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label" for="linkQueryString">Link Query String (please do not add the '?')<br>This is used for appending query strings to a non-search term above.</label>
			<input type="input" class="formField slds-input" name="linkQueryString">
		</div>

		<div class="inputRow">
			<label class="slds-form-element__label">Text</label>
			<input type="input" class="formField slds-input" name="text">
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label">Aria Label</label>
			<input type="input" class="formField slds-input" name="ariaLabel">
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label">Style</label>
			<select class="formField slds-input" name="style">
				<option value="standard-link">Standard</option>
				<option value="btn-primary">Primary Button</option>
				<option value="btn-light">Light Button</option>
			</select>
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label" for="buttonWidth">Button Width</label>
			<select class="formField slds-input" name="buttonWidth" id="buttonWidth">
				<option value="d-inline-flex">Tight</option>
				<option value="btn-size--short">Short</option>
				<option value="btn-size--medium">Medium</option>
				<option value="w-100" selected>Full Width</option>
			</select>
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label" for="showLinkArrow">Show Link Arrow</label>
			<select class="formField slds-input" name="showLinkArrow" id="showLinkArrow">
				<option value="noArrow" selected>No</option>
				<option value="showLinkArrow">Yes</option>
			</select>
		</div>
		<!--div class="inputRow">
			<label class="slds-form-element__label" for="buttonAlign"></label>
			<select class="formField slds-input" name="buttonAlign" id="buttonAlign">
				<option value="mr-auto">Left</option>
				<option value="m-auto">Center</option>
				<option value="ml-auto">Right</option>
			</select>
		</div-->
		<div class="inputRow">
			<label class="slds-form-element__label">Classes</label>
			<input type="input" class="formField slds-input" name="classes">
		</div>
	</div>
	`;


	subscribe('sfcc:ready', async ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {

		$('body').append(coreHTML);

		var arrayName = 'linksArray';

		if (value.breakoutFieldID && value.breakoutFieldID.includes('-')) {
			var breakoutFieldData = value.breakoutFieldID.split('-');
			arrayName = breakoutFieldData[0];
			value.currentEditor = breakoutFieldData[1];
		}

		if (value.currentEditor != null) {
			// If currentEditor exists, we are dealing with an editor that has been previously created/saved.
			// First, grab a fresh copy of the settings object in case new attributes have been added since the editor was last saved.
			var emptyEditor = settingsObject;
			var savedEditor = value[arrayName][value.currentEditor];

			// Then apply the previously saved values to that object
			var currentEditor = $.extend({}, emptyEditor, savedEditor);

			settingsObject = currentEditor;
			$('[name="displayName"]').val(settingsObject.displayName);
			$('[name="linkID"]').val(settingsObject.linkValue);
			$('[name="text"]').val(settingsObject.text);
			$('[name="ariaLabel"]').val(settingsObject.ariaLabel);
			$('[name="style"]').val(settingsObject.style);
			$('[name="linkQueryString"]').val(settingsObject.linkQueryString);
			$('[name="buttonWidth"]').val(settingsObject.buttonWidth);
			// $('[name="buttonAlign"]').val(settingsObject.buttonAlign);
			$('[name="showLinkArrow"]').val(settingsObject.showLinkArrow);
			$('[name="classes"]').val(settingsObject.classes);
			if (Array.isArray(settingsObject.linkBuilder) && settingsObject.linkBuilder[0] === "Product-Show") {
				$(".productOnly").show();
			}
		}

		$buttonEl = $(document).find('#linkBreakout').first();
		$buttonEl.on('click', handleBreakoutOpen);

		$(document).on('change', '.formField', function () {
			var value = $(this).val();
			var field = $(this).attr('name');
			settingsObject[field] = value;
			emitValue();
		});

		$(document).on('change', '.configField', function () {
			var value = $(this).val();
			var field = $(this).attr('name');
			emitValue();
		});

		emitValue();
	});
	function handleBreakoutOpen() {
		emit({
			type: 'sfcc:breakout',
			payload: {
				id: 'sfcc:linkBuilder',
				title: 'Link'
			}
		}, handleBreakoutClose);
	};
	function handleBreakoutClose({ type, value }) {
		if (type === 'sfcc:breakoutApply') {
			handleBreakoutApply(value);
		} else {
			handleBreakoutCancel();
		}
	}

	function handleBreakoutCancel() {
		// Grab focus
		$buttonEl && $buttonEl.focus();
	}

	function handleBreakoutApply(response) {
		settingsObject.linkBuilder = response.value;
		if (response.value != null) {
			if (Array.isArray(response.value) && response.value[0] === "Product-Show") {
				$(".productOnly").show();
			} else {
				$(".productOnly").hide();
			}
			if (Array.isArray(response.value)) {
				$("[name='linkID']").val(response.value[2]);
				settingsObject.linkValue = response.value[2];
				settingsObject.linkIsArray = true;
			} else {
				$("[name='linkID']").val(response.value);
				settingsObject.linkValue = response.value;
				settingsObject.linkIsArray = false;
			}
		} else {
			$("[name='linkID']").val('');
		}
		emitValue();

		// Grab focus
		$buttonEl && $buttonEl.focus();
	}

	function emitValue() {
		if (!settingsObject.style) {
			settingsObject.style = 'btn-primary';
		}
		emit({
			type: 'sfcc:value',
			payload: settingsObject
		});
	}
})();
