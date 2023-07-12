(() => {
	let dataArray = [];
	let $created;
	let $defaultOpenSelect;
	let currentEditor;
	let defaultOpenSection = "none";
	let iconURL;

	subscribe('sfcc:ready', ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
		if (value && value.sections) {
			dataArray = value.sections;
			defaultOpenSection = value.defaultOpenSection;
		}
		iconURL = config.iconURL;

		$('body').append(`
			<div class="slds-box slds-box_x-small">
				<ol class="slds-m-bottom_x-small" id="created"></ol>
				<button type="button" class="slds-button slds-m-bottom_x-small slds-button_brand slds-button_stretch breakoutButton">Add an Accordion Section</button>
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="select-01">Should a section default to being open?</label>
					<div class="slds-form-element__control">
					<div class="slds-select_container">
						<select class="slds-select" id="defaultOpenSection">
							<option value="none">None</option>
						</select>
					</div>
					</div>
				</div>
			</div>
		`);

		$created = $("#created");
		$defaultOpenSelect = $("#defaultOpenSection");

		buildGUI();

		$created.on('click', '.removeButton', function () {
			var index = $(this).closest('.createdElement').data('position');
			dataArray.splice(index, 1);
			buildGUI();
			emitValue();
		});
		$created.on('click', '.upButton', function () {
			var index = $(this).closest('.createdElement').data('position');
			if (index > 0) {
				array_move(dataArray, index, index - 1);
				buildGUI();
				emitValue();
			}
		});
		$created.on('click', '.downButton', function () {
			var index = $(this).closest('.createdElement').data('position');
			if (index != (dataArray.length - 1)) {
				array_move(dataArray, index, index + 1);
				buildGUI();
				emitValue();
			}
		});
		$(document).on('click', '.breakoutButton', function () {
			currentEditor = null;
			if ($(this).closest('.createdElement').length > 0) {
				currentEditor = $(this).closest('.createdElement').data('position');
			}
			emitValue();
			handleBreakoutOpen();
		});
		$defaultOpenSelect.on('change', function () {
			defaultOpenSection = $(this).val();
			emitValue();
		});
	});

	subscribe('sfcc:value', value => {
		dataArray = value.sections;
		buildGUI();
	});

	function buildGUI() {
		$created.html('');
		$defaultOpenSelect.html('<option value="none">None</option>');
		dataArray.forEach((element, index) => {
			var elementHTML = `
			<li class="createdElement" data-position="${index}">
				<div class="slds-grid slds-grid_vertical-align-start slds-m-bottom_x-small">
					<div class="slds-col slds-grow">
						<div class="slds-form-element">
							<div class="slds-form-element__control"><input value="${element.title}" disabled class="slds-input"/></div>
						</div>
					</div>
					<div class="slds-col slds-grow-none slds-m-left_xx-small">
						<div class="slds-button-group item-options" role="group">
							<button type="button" class="slds-button slds-button_brand breakoutButton" title="Edit Section"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#settings"></use></svg></button>
							<button type="button" class="slds-button slds-button_neutral upButton" title="Move Section Up One"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowup"></use></svg></button>
							<button type="button" class="slds-button slds-button_neutral downButton" title="Move Section Down One"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowdown"></use></svg></button>
							<button type="button" class="slds-button slds-button_destructive removeButton" title="Delete Section"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#close"></use></svg></button>
						</div>
					</div>
				</div>
			</li>`;

			$created.append(elementHTML);
			$defaultOpenSelect.append('<option value="' + index + '">' + element.title + '</option>');
		});
		if (defaultOpenSection != null) {
			$defaultOpenSelect.val(defaultOpenSection);
		}
	}

	function handleBreakoutOpen() {
		emit({
			type: 'sfcc:breakout',
			payload: {
				id: 'accordionBreakout',
				title: 'Accordion Section Builder',
			}
		}, handleBreakoutClose);
	}

	function handleBreakoutClose({ type, value }) {
		if (type === 'sfcc:breakoutApply') {
			handleBreakoutApply(value);
		} else {
			handleBreakoutCancel();
		}
	}

	function handleBreakoutCancel() {
		handleButtonFocus();
	}

	function handleBreakoutApply(response) {
		if (currentEditor != null) {
			dataArray[currentEditor] = response;
		} else {
			dataArray.push(response);
		}
		buildGUI();
		emitValue()
		handleButtonFocus();
	}

	function handleButtonFocus() {
		if (currentEditor != null) {
			$('.createdElement[data-position="' + currentEditor + '"]').find('.breakoutButton').focus();
		} else {
			$('.breakoutButton').last().focus();
		}
	}

	function array_move(arr, old_index, new_index) {
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

	function emitValue() {
		emit({
			type: 'sfcc:value',
			payload: {
				sections: dataArray,
				currentEditor: currentEditor,
				defaultOpenSection: defaultOpenSection
			}
		});
	}
})();
