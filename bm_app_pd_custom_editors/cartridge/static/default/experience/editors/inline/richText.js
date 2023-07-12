(() => {
    let payload = {
        richTextEditor: null,
        output: ''
    };

    /**
     * This listener subscribes to the creation/initialization event of the sandbox component. This event gets fired when a Page Designer user
     * first opens a component of a certain type in the component settings panel (and that component type contains the custom editor).
     * **Note:** This event won't fire when the user switches between components of the same type in the canvas. In that case the existing
     * attribute editor components will be reused which results in a value update event (`sfcc:value`), therefore no new initialization
     * happens.
     */
    subscribe('sfcc:ready', ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
        iconURL = config.iconURL;
        init(value);
        emitValue();
    });

    /**
     * This listener subscribes to external value updates. As stated above, this event also gets fired when the user switches between
     * different components of the same type in the canvas. As in that case already existing custom editor instances get reused, it
     * technically means that switching between components of the same type is just an external value update.
     */
    subscribe('sfcc:value', (value) => {
        init(value);
    });

    function emitValue() {
        emit({
            type: 'sfcc:value',
            payload: payload
        });
    }

    /*
     * this function relies upon the Quill Library.
     * https://quilljs.com/
     * Quill is the base library used everywhere in the Salesforce ecosystem for their rich text editors
     *
     */
    function init(value) {
        if (value) {
            for (property in payload) {
                if (value[property]) {
                    payload[property] = value[property];
                }
            }
        }

        let output = `
		<div class="slds-form-element newQuill">
			<div class="slds-form-element__control">
                <label class="slds-form-element__label slds-assistive-text">Content</label>
                <div aria-label="Compose text" contenteditable="true" class="slds-rich-text-area__content slds-text-color_weak slds-grow" id="richTextEditor"></div>
            </div>
        </div>
		`;

        $('body').append(output);

        // establish the Editor container
        var richTextEditorContainer = document.getElementById('richTextEditor');

        // custom toolbar options
        var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'header': [false, 2, 3, 4] }],
            [{ 'align': [] }],
            ['clean']                                         // remove formatting button
        ];

        // Initialize the Editor object
        // Using the 'exports' object to call Quill from is crucial here
        // Because the JS files that are included in the component's json are distributed as UMD, the library objects are added to the 'exports' object
        var richTextEditorObject = new exports.Quill(richTextEditorContainer, {
            readOnly: false,
            modules: {
                toolbar: toolbarOptions 
            },
            theme: 'snow'
        });

        // establish the Editor ID
        const id = richTextEditorContainer.getAttribute('id');

        // set the content of the Editor from the 'delta' in the payload object (aka database)
        richTextEditorObject.setContents(payload[id]);

        // update the payload object with new data
        richTextEditorObject.on('text-change', function (delta, oldDelta, source) {

            // if the user has typed something...
            if (source == 'user') {
                
                // store the 'delta' to the database for the editor
                payload[id] = richTextEditorObject.getContents();
                
                // store the raw html to the database for html output in the ISML
                payload.output = richTextEditorObject.root.innerHTML;
            }

            // save to the database
            emitValue();
        });
    }
})();
