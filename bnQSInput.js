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
			switch (layout.rType) {
				case 'a':
					var $input = bnHelper.createInput(layout);
					$output.html($input);
				break;
				case 'b':
					var $select = bnHelper.createSelect(layout);
					$output.html($select);
				break;
				case 'c':
					var $button = bnHelper.createButton(layout);
					$output.html($button);
				break;
				case 'd':
					var $slider = $(bnHelper.createElement('div', 'bnSliderDiv')).slider(bnHelper.createSlider(layout));
					$slider.find('span').addClass('bnSliderHandle');
					$output.html($slider);
				break;
				case 'e':
					var $calBox = bnHelper.createCalBox(layout);
					$output.html($calBox);
					
				break;
			}
			$element.append( $output );
        }
	}
});