function conditionalCheck(conditionalElement, checkedValue, trigger) {
	var $trigger = $('#' + trigger);
	var triggerValue;

	if ($trigger.is(':checkbox')) {
		triggerValue = $trigger.is(':checked');
	} else {
		triggerValue = $trigger.val();
	}
	if (!Array.isArray(checkedValue)) {
		checkedValue = [checkedValue];
	}
	if (checkedValue.includes(triggerValue)) {
		if ($(conditionalElement).is('option')) {
			$(conditionalElement).attr('disabled', false);
		} else {
			$(conditionalElement).removeClass('conditionally-hidden');
		}
	} else {
		if ($(conditionalElement).is('option')) {
			$(conditionalElement).attr('disabled', 'disabled');
			if ($(conditionalElement).is(':selected')) {
				$(conditionalElement).parent().val('default');
			}
		} else {
			$(conditionalElement).addClass('conditionally-hidden');
			$(conditionalElement).find('input, select, textarea, select').each(function () {
				if ($(this).is(':checkbox, :radio')) {
					$(this).checked = false;
				} else {
					$(this).val('');
				}
				$(this).trigger('change');
			});
		}
	}
}

$(document).on('built', function () {
    if ($('.breadcrumbs').length > 0) {
        var parent = $('.parentReferenceFields #parentdisplayName').val();
        var displayName = $('#displayName').val();
        var crumbs = [];

        if (parent) crumbs.push(parent);
        if (displayName) {
            crumbs.push(displayName);
        } else {
            crumbs.push('New');
        }

        var h2 = $('<h2></h2>');
        h2.addClass('slds-text-heading_medium');
        h2.html(crumbs.join(' -> '));
        $('.breadcrumbs').html(h2);
    }
    $('#advanced').on('click', function () {
        $('.ce-advanced').toggleClass('show');

        if ($('.ce-advanced').hasClass('show')) {
            var text = $(this).data('hide-text');
            $(this).html(text);
        } else {
            var text = $(this).data('show-text');
            $(this).html(text);
        }
    });

    // Helps us appropriately change and store the value of checkboxes or radio buttons
    // See newHelpers.js
    $('.setting').on('change', function () {
        var id = $(this).attr('name');
        var val = null;
        if ($(this).is(':checkbox')) {
            val = $(this).is(':checked');
        } else if ($(this).is(':radio')) {
            val = $(this).attr('value');
        } else {
            val = $(this).val();
        }
        $(document).trigger('settingChange', [id, val]);
    });

    // Helps us appropriately change and store the value of inputs of the type range
    $(document).on('input change', '.rangeSlider', function () {
        var id = $(this).attr('id');
        var val = null;
        val = $(this).val();
        $(this).next('.slds-slider__value').html(val);
        $(document).trigger('settingChange', [id, val]);
    });

    $('.raw').on('change', function () {
        var id = $(this).data('raw-id');
        var val = $(this).val();
        var jsonVal = JSON.parse(val);
        $(document).trigger('settingChange', [id, jsonVal]);
    });

    $('body').on('click', '.breakout', function () {
        var type = $(this).data('type');
        var settings = $(this).data('settings');
        var id = $(this).attr('id');
        var addAnother = $(this).hasClass('addAnother');
        $(this).addClass('lastFocus');
        $(document).trigger('breakoutOpen', [type, settings, id, addAnother]);
    });

    $('body').on('click', '.addedItems .removeButton', function () {
        var id = $(this).data('item');
        $(document).trigger('addAnotherRemove', [id]);
    });

    $('body').on('click', '.addedItems .downButton', function () {
        var id = $(this).data('item');
        $(document).trigger('addAnotherMoveDown', [id]);
    });

    $('body').on('click', '.addedItems .upButton', function () {
        var id = $(this).data('item');
        $(document).trigger('addAnotherMoveUp', [id]);
    });

    $('body').on('click', '.clearFieldButton', function () {
        var id = $(this).data('id');
        $(document).trigger('clearField', [id]);
    });

    $('[data-trigger]').each(function () {
        var trigger = $(this).data('trigger');
        var value = $(this).data('trigger-value');
        var conditionalElement = this;
        conditionalCheck(conditionalElement, value, trigger);
        $('#' + trigger).on('change', function () {
            conditionalCheck(conditionalElement, value, trigger);
        });
    });

    $(document).on('breakoutClose', function () {
        var $lastFocus = $('.lastFocus');
        $lastFocus.trigger('focus').removeClass('lastFocus');
    });
});
