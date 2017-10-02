define(["qlik", "./properties", "./initialProps","./bnHelper","jquery","jqueryui"], 
	
function ( qlik, props, initProps, bnHelper, $) {
    'use strict';
	return {
		definition: props,
		initialProperties: initProps,
        paint: function ( $element , layout ) {
			var ext = this;
            bnHelper.addStyleSheet("extensions/bnQSInput/style.css");
			$element.empty(); $element.append('<div>');
			var $output = $(bnHelper.createElement('div', 'bnContainer'));
			$output.append( bnHelper.createLabel(layout) );
			switch (layout.rType) {
				case 'a':
					var $input = bnHelper.createInput(layout);
					$output.append($input);
				break;
				case 'b':
					var $select = bnHelper.createSelect(layout);
					$output.append($select);
				break;
				case 'c':
					var $button = bnHelper.createButton(layout);
					$output.append($button);
				break;
				case 'd':
					var $slider = bnHelper.createSlider(layout);
					$output.append($slider);
				break;
				case 'e':
					var $calBox = bnHelper.createCalBox(layout);
					$output.append($calBox);
					
				break;
			}
			$element.append( $output );
        }
	}
});