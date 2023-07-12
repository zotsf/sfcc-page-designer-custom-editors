(() => {
	let iconURL;
	let maxLinks;
	let dataArray = [];
	let $addedLinks;
	let currentEditor;
	let $createButton;

	const coreHTML = `
		<div class="slds-box slds-box_x-small">
			<div id="addedLinks"></div>
			<button type="button" id="createButton" class="slds-button slds-button_stretch slds-button_brand breakoutButton">Add Link</button>
		</div>
	`;

	/**
	 * This listener subscribes to the creation/initialization event of the sandbox component. This event gets fired when a Page Designer user
	 * first opens a component of a certain type in the component settings panel (and that component type contains the custom editor).
	 * **Note:** This event won't fire when the user switches between components of the same type in the canvas. In that case the existing
	 * attribute editor components will be reused which results in a value update event (`sfcc:value`), therefore no new initialization
	 * happens.
	 */
	subscribe('sfcc:ready', ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
		maxLinks = config.maxLinks;
		iconURL = config.iconURL;

		if (value && value.linksArray) {
			dataArray = value.linksArray;
		}


		$('body').append(coreHTML);

		// Obtain DOM elements and apply event handlers
		$addedLinks = $("#addedLinks");
		$createButton = $("#createButton");
		buildGUI();

		$addedLinks.on('click', '.removeButton', function () {
			var index = $(this).closest('.addedLink').data('position');
			dataArray.splice(index, 1);
			buildGUI();
			emitValue();
		});
		$addedLinks.on('click', '.upButton', function () {
			var index = $(this).closest('.addedLink').data('position');
			console.log('up ' + index);
			if (index > 0) {
				array_move(dataArray, index, index - 1);
				buildGUI();
				emitValue();
			}
		});
		$addedLinks.on('click', '.downButton', function () {
			var index = $(this).closest('.addedLink').data('position');
			console.log('down ' + index);
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
			handleBreakoutOpen(config);
		});

		$(document).on('change', '.formField', function () {
			var value = $(this).val();
			var field = $(this).attr('name');
			emitValue();
		});
	});

	/**
	 * This listener subscribes to external value updates. As stated above, this event also gets fired when the user switches between
	 * different components of the same type in the canvas. As in that case already existing custom editor instances get reused, it
	 * technically means that switching between components of the same type is just an external value update.
	 */
	subscribe('sfcc:value', value => {
		dataArray = value.linksArray;
		buildGUI();
	});

	function buildGUI() {
		$addedLinks.html('');
		dataArray.forEach((link, index) => {
			var linkElement = `
			<div class="slds-m-bottom_x-small createdElement addedLink" data-position="${index}">
				<div class="slds-grid slds-grid_vertical-align-start">
					<div class="slds-col slds-grow">
						<button type="text" class="slds-button slds-button_brand slds-button_stretch breakoutButton">
							${link.displayName ? link.displayName : link.linkValue}
							<svg class="slds-button__icon slds-button__icon_right" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#settings"></use></svg>
						</button>
					</div>
					<div class="slds-col slds-grow-none slds-m-left_xx-small">
						<div class="slds-button-group" role="group">
							<button type="button" class="slds-button slds-button_neutral upButton"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowup"></use></svg></button>
							<button type="button" class="slds-button slds-button_neutral downButton"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#arrowdown"></use></svg></button>
							<button type="button" class="slds-button slds-button_destructive removeButton"><svg class="slds-button__icon" aria-hidden="true"><use xlink:href="${iconURL}symbols.svg#close"></use></svg></button>
						</div>
					</div>
				</div>
			</div>`;
			$addedLinks.append(linkElement);
		});
		if (dataArray.length >= maxLinks) {
			$createButton.prop("disabled", true);
		} else {
			$createButton.prop("disabled", false);
		}
		if (maxLinks != null) {
			$createButton.html("Add Link (" + dataArray.length + " of " + maxLinks + ")");
		}
	}

	function handleBreakoutOpen(config) {
		emit({
			type: 'sfcc:breakout',
			payload: {
				id: 'linkBreakout',
				title: 'Link Builder'
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
				linksArray: dataArray,
				currentEditor: currentEditor
			}
		});
	}
})();
