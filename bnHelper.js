define(["qlik","jquery","jqueryui"], 	
function ( qlik, $) {
    'use strict';
	var app = qlik.currApp();
	
	function setVariable(name,val){
		if(!isNaN(val)) app.variable.setNumValue(name, parseFloat(val));
		else app.variable.setStringValue(name,val);
	}
	
	function setFieldValue(layout,values){
		var srcStr = '';
		if(layout.reverseSlider === true) {
			switch(layout.rangeLogic){
				case 'a': srcStr = '<'  + values[0] + '>'  + values[1]; break;
				case 'b': srcStr = '<=' + values[0] + '>'  + values[1]; break;
				case 'c': srcStr = '<=' + values[0] + '>=' + values[1]; break;
				case 'd': srcStr = '<'  + values[0] + '>=' + values[1]; break;
			}
		} else {
			switch(layout.rangeLogic){
				case 'a': srcStr = '>'  + values[0] + '<'  + values[1]; break;
				case 'b': srcStr = '>=' + values[0] + '<'  + values[1]; break;
				case 'c': srcStr = '>=' + values[0] + '<=' + values[1]; break;
				case 'd': srcStr = '>'  + values[0] + '<=' + values[1]; break;
			}
		}
		app.field(layout.fName).selectMatch(srcStr, true);
		
	}
	
    function createElement(tag, cls, html) {
        var el = document.createElement(tag);
        if (cls) { el.className = cls; }
        if (html !== undefined) { el.innerHTML = html; }
        return el;
    }
	
	function addStyleSheet(href) {
		var link = createElement('link'); link.rel = "stylesheet"; link.type = "text/css"; link.href = require.toUrl(href); document.head.appendChild(link);
	}
	
    function setChild(el, ch) {
        if (el.childNodes.length === 0) { el.appendChild(ch); } 
		else { el.replaceChild(ch, el.childNodes[0]); }
    }
	
	function createLabel(layout){
		if(layout.showvarlabels === true && layout.rType !== 'c'){
			var nClass;
			layout.labelsbold === true ? nClass = 'bnLabel bnbold': nClass = 'bnLabel';
			var $label = $(createElement('label',nClass));
			if(layout.ownwidth === true && layout.labelwidth != '') $($label).css('width',layout.labelwidth);
			if(layout.rType === 'd'){
				if(layout.sType === 'r'){
					$($label).html(layout.namelabel1 + ': ' + layout.var1Value + ' ' + layout.namelabel2 + ': ' + layout.var2Value );
				} else {
					$($label).html(layout.namelabel1 + ': ' + layout.var1Value  );
				}
			} else {
				$($label).html(layout.namelabel1);
			}
			return $label;
		} else return '';
	}
	
	function createSlider(layout){
		
		switch (layout.sType){
			case 's':
				var sliderSettings = { 
					min: layout.min,
					max: layout.max,
					step: layout.step,
					value: layout.var1Value.replace(',','.'),
					stop: function( event, ui ) {
						setVariable(layout.var1,ui.value)
						
					}
				};
			break;
			case 'r':
				var sliderSettings = {
					range: true,
					min: layout.min,
					max: layout.max,
					step: layout.step,
					values: [layout.var1Value.replace(',','.'),layout.var2Value.replace(',','.')],
					stop: function( event, ui ) {
						if(layout.oType == 'f') {
							setFieldValue(layout,ui.values)
						} 
						setVariable(layout.var1,ui.values[0]);
						setVariable(layout.var2,ui.values[1]);
						
					}
				};
			break;
		}	
		var $slider = $(createElement('div', 'bnSliderDiv')).slider(sliderSettings);
		if(layout.showvarlabels === true){
			$($slider).css('margin-top','0px');
		}
		$slider.find('span').addClass('bnSliderHandle');
		return $slider;
	}
	
	function createInput(layout){
		var $inputBox = $(createElement('input','bnInput'));
		$($inputBox).change(function(){ 
			setVariable(layout.var1,$($inputBox).val()); 
		}).attr('value',layout.var1Value);
		if(layout.ownwidth === true && layout.objectwidth != '') $($inputBox).css('width',layout.objectwidth);
		return $inputBox;
	}
	
	function createSelect(layout){
		var $select = createElement('select','bnSelect');
		if(layout.ownwidth === true && layout.objectwidth != '') $($select).css('width',layout.objectwidth);
		switch (layout.setvalues){	
			case "a":
				var $select = createElement('select','bnSelect');
				layout.varvalues.forEach(function (alt) {
					var opt = createElement('option', undefined, alt.label);
					opt.value = alt.value;
					opt.selected = alt.value === layout.var1Value;
					$select.appendChild(opt);
				});
			break;
			case "f": 
			case "c":
				var aArr = [];
				layout.setvalues == "f" && layout.fieldValues != '' ? aArr = layout.fieldValues.split(",") : aArr = layout.valStr.split(",")
				aArr.forEach(function (element) {
					var opt = createElement('option', undefined, element);
					opt.value = element;
					opt.selected = element === layout.var1Value;
					$select.appendChild(opt);
				});
				
			break;
		}
		$($select).change(function () { setVariable(layout.var1,this.value); });
		return $select
	}
	
	function createButton(layout){
		var $buttons = createElement('div');
		switch (layout.setvalues){
			case "a":
				layout.varvalues.forEach(function (alt) {
					var classN = '';
					alt.value === layout.var1Value ? classN = 'bnButton bactive': classN = 'bnButton';
					var $button = createElement('button',classN,alt.label);
					$($button).attr('value',alt.value).click(function () { setVariable(layout.var1,this.value); });
					$buttons.appendChild($button);
				});
			break;
			case "f": 
			case "c":
				var aArr = [];
				layout.setvalues == "f" && layout.fieldValues != '' ? aArr = layout.fieldValues.split(",") : aArr = layout.valStr.split(",")
				aArr.forEach(function (element) {
					var classN = '';
					element === layout.var1Value ? classN = 'bnButton bactive': classN = 'bnButton';
					var $button = createElement('button',classN,element);
					$($button).attr('value',element).click(function () { setVariable(layout.var1,this.value); });
					$buttons.appendChild($button);
				});
				
			break;
		}
		return $buttons
	}
	
	function createCalBox(layout){
		var aNumber = 1; var ardMin = ''; var ardMax = ''; 
		var $calBox = createElement('input','bnInput');
		layout.multimonth === true ?  aNumber = 3:  aNumber = 1;
		layout.rdMin != '' && layout.restrictdate === true ?  ardMin = layout.rdMin:  ardMin = '';
		layout.rdMax != '' && layout.restrictdate === true ?  ardMax = layout.rdMax:  ardMax = '';
		if(layout.ownwidth === true && layout.objectwidth != '') $($calBox).css('width',layout.objectwidth);
		$($calBox).datepicker({
			showButtonPanel: layout.showButtonPanel,
			dateFormat: layout.dateformat,
			numberOfMonths: aNumber,
			minDate: ardMin,
			maxDate: ardMax
		}).change(function () { setVariable(layout.var1,this.value); }
		).attr('value',layout.var1Value);
		return $calBox;
	}
	
    return {
        createElement: createElement
        , setChild: setChild
        , addStyleSheet: addStyleSheet
		, createLabel: createLabel
		, createSlider: createSlider
		, createInput: createInput
		, createSelect: createSelect
		, createButton: createButton
		, createCalBox: createCalBox
    };
});
