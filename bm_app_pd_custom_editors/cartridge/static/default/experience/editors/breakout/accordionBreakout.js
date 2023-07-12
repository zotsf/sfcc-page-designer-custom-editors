(() => {
    let settingsObject = {
        title: null,
        content: null
    };

    const coreHTML = `
	<div id="settings" class="slds-m-horizontal_small">
		<div class="inputRow">
			<label class="slds-form-element__label"><abbr class="slds-required" title="required">* </abbr>Title</label>
			<input type="input" class="formField slds-input" name="title">
		</div>
		<div class="inputRow">
			<label class="slds-form-element__label"><abbr class="slds-required" title="required">* </abbr>Expandable Content</label>
			<textarea class="formField slds-textarea" name="content"></textarea>
		</div>
	</div>
	`;

    subscribe('sfcc:ready', async ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
        var iconURL = config.iconURL;

        $('body').append(coreHTML);

        if (value.currentEditor != null) {
            settingsObject = value.sections[value.currentEditor];
            $('[name="title"]').val(settingsObject.title);
            $('[name="content"]').val(settingsObject.content);
        }
        checkValidAndEmitValue();

        $(document).on(
            'keyup',
            '.formField',
            debounce(function () {
                var value = $(this).val();
                var field = $(this).attr('name');
                settingsObject[field] = value;
                checkValidAndEmitValue();
            }, 200)
        );
    });

    function emitValue() {
        emit({
            type: 'sfcc:value',
            payload: settingsObject
        });
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function checkValidAndEmitValue() {
        if (settingsObject.title == null || settingsObject.content == null || settingsObject.title == '' || settingsObject.content == '') {
            emit({
                type: 'sfcc:valid',
                payload: {
                    valid: false,
                    message: 'Both the Title and Content fields are required.'
                }
            });
        } else {
            emit({
                type: 'sfcc:valid',
                payload: true
            });
        }
        emitValue();
    }
})();
