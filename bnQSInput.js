define(["qlik", "./properties", "./initialProps","./bnHelper","jquery","jqueryui"], 
function ( qlik, props, initProps, bnHelper, $) {
    'use strict';
	return {
		definition: props,
		initialProperties: initProps,
        paint: function ( $element , layout ) {
			
            bnHelper.addStyleSheet("extensions/bnQSInput/style.css");
			$element.empty();
			
			var $output = $(bnHelper.createElement('div', 'bnContainer'));
			$output.append(bnHelper.createLabel(layout) );
			
			switch (layout.rType) {
				case 'a': $output.append(bnHelper.createInput(layout)); 	break;
				case 'b': $output.append(bnHelper.createSelect(layout)); 	break;
				case 'c': $output.append(bnHelper.createButton(layout));	break;
				case 'd': $output.append(bnHelper.createSlider(layout));	break;
				case 'e': $output.append(bnHelper.createCalBox(layout));	break;
			}
			$element.append( $output );
        }
	}
});