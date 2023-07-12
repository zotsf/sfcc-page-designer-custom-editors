(() => {
    let editorDefinition = {
        settings: {
            version: 1,
            name: 'textAlign'
        },
        fields: {
            alignMobile: {
                label: 'Align Mobile',
                type: 'alignButtons',
                default: 'center',
                options: [
                    {
                        id: 'left',
                        label: 'Left'
                    },
                    {
                        id: 'center',
                        label: 'Center'
                    },
                    {
                        id: 'right',
                        label: 'Right'
                    }
                ],
                width: 'half'
            },
            alignDesktop: {
                label: 'Align Desktop',
                type: 'alignButtons',
                default: 'left',
                options: [
                    {
                        id: 'left',
                        label: 'Left'
                    },
                    {
                        id: 'center',
                        label: 'Center'
                    },
                    {
                        id: 'right',
                        label: 'Right'
                    }
                ],
                width: 'half'
            }
        },
        componentDefinedDefaults: {},
        componentDefinedHidden: []
    };

    /**
     * This listener subscribes to the creation/initialization event of the sandbox component. This event gets fired when a Page Designer user
     * first opens a component of a certain type in the component settings panel (and that component type contains the custom editor).
     * **Note:** This event won't fire when the user switches between components of the same type in the canvas. In that case the existing
     * attribute editor components will be reused which results in a value update event (`sfcc:value`), therefore no new initialization
     * happens.
     */
    subscribe('sfcc:ready', ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
        // If the component has defined defaults, set them
        if (config.hasOwnProperty('defaults')) {
            editorDefinition.componentDefinedDefaults = config.defaults;
        }

        // If the component has defined hidden fields, set them
        if (config.hasOwnProperty('hidden')) {
            editorDefinition.componentDefinedHidden = config.hidden;
        }

        newHelpers.init(value, editorDefinition, config);
    });

    /**
     * This listener subscribes to external value updates. As stated above, this event also gets fired when the user switches between
     * different components of the same type in the canvas. As in that case already existing custom editor instances get reused, it
     * technically means that switching between components of the same type is just an external value update.
     */
    subscribe('sfcc:value', (value) => {
        newHelpers.init(value, editorDefinition, config);
    });
})();
