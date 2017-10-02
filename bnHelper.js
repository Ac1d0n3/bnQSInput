define(["qlik","jquery","jqueryui"], 
	
function ( qlik, $) {
    'use strict';

	var app = qlik.currApp();
	
    function createElement(tag, cls, html) {
        var el = document.createElement(tag);
        if (cls) { el.className = cls; }
        if (html !== undefined) { el.innerHTML = html; }
        return el;
    }
	function setVariable(name,val){
		if(!isNaN(val)) app.variable.setNumValue(name, parseInt(val));
		else app.variable.setStringValue(name,val);
	}
    function setChild(el, ch) {
        if (el.childNodes.length === 0) { el.appendChild(ch); } 
		else { el.replaceChild(ch, el.childNodes[0]); }
    }
    function createVariable(name) {
        if (app.variable.getByName) { app.variable.getByName(name).then(function () {}, function () { app.variable.create(name); });
        } else { app.variable.create(name); }
    }
	
	function createSlider(layout,ext){
		switch (layout.sType){
			case 's':
				var sliderSettings = { 
					min: layout.min,
					max: layout.max,
					step: layout.step,
					value: layout.var1Value,
					stop: function( event, ui ) {
						setVariable(layout.var1,ui.value)
					   //app.variable.setContent(layout.var1, ui.value);
					}
				};
			break;
			case 'r':
				var sliderSettings = {
					range: true,
					min: layout.min,
					max: layout.max,
					step: layout.step,
					values: [layout.var1Value,layout.var2Value],
					stop: function( event, ui ) {
						setVariable(layout.var1,ui.values[0])
						setVariable(layout.var2,ui.values[1])
					}
				};
			break;
		}	
		return sliderSettings;
	}
	
	function createInput(layout){
		var $inputBox = $(createElement('input','bnInput'));
		$($inputBox).change(function(){ setVariable(layout.var1,$($inputBox).val()); });
		$($inputBox).attr('value',layout.var1Value);
		return $inputBox;
	}
	
	function createSelect(layout){
		var $select = createElement('select','bnSelect');
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
				layout.setvalues == "f" ? aArr = layout.fieldValues.split(",") : aArr = layout.valStr.split(",")
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
					$($button).attr('value',alt.value);
					$($button).click(function () { setVariable(layout.var1,this.value); });
					$buttons.appendChild($button);
				});
			break;
			case "f": 
			case "c":
				var aArr = [];
				layout.setvalues == "f" ? aArr = layout.fieldValues.split(",") : aArr = layout.valStr.split(",")
				aArr.forEach(function (element) {
					var classN = '';
					element === layout.var1Value ? classN = 'bnButton bactive': classN = 'bnButton';
					var $button = createElement('button',classN,element);
					$($button).attr('value',element);
					$($button).click(function () { setVariable(layout.var1,this.value); });
					$buttons.appendChild($button);
				});
				
			break;
		}
		return $buttons
	}
	
	function createCalBox(layout){
		var $cw = createElement('div');
		var $calBox = createElement('input','bnInput');
		var aNumber = 1;
		var ardMin = '';
		var ardMax = '';
		layout.multimonth === true ?  aNumber = 3:  aNumber = 1;
		
		layout.rdMin != '' && layout.restrictdate === true ?  ardMin = layout.rdMin:  ardMin = '';
		layout.rdMax != '' && layout.restrictdate === true ?  ardMax = layout.rdMax:  ardMax = '';
		
		$($calBox).datepicker(
			{
			  showButtonPanel: layout.showButtonPanel,
			  dateFormat: layout.dateformat,
			  numberOfMonths: aNumber,
			  minDate: ardMin,
			  maxDate: ardMax
			}
		);
		$($calBox).change(function () { setVariable(layout.var1,this.value); });
		$($calBox).attr('value',layout.var1Value);
		return $calBox;
	}
	
	function addStyleSheet(href) {
		var link = createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = require.toUrl(href);
		document.head.appendChild(link);
	}
	
    return {
        createElement: createElement
        , setChild: setChild
        , addStyleSheet: addStyleSheet
		, createSlider: createSlider
        , createVariable: createVariable
		, createInput: createInput
		, createSelect: createSelect
		, createButton: createButton
		, createCalBox: createCalBox
    };
});
