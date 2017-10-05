define(["qlik", "jquery","./languages",'ng!$q'], 
	
function ( qlik, $, $dict, $q) {
	'use strict';
	
	var lang = 'DE';

	var app = qlik.currApp();
	
	var getVariableList = function(){
		var defer = $q.defer();
		app.getList( 'VariableList', function ( items ) {
			defer.resolve( items.qVariableList.qItems.map( function ( item ) {
					return {
						value: item.qName,
						label: item.qName
					}
				} )
			);
		} );
		return defer.promise;
	}
	
	
	var MainSettings = {
		type: "items",
		label: $dict[lang].MainSettings,
		items: {
			renderType: {
				type: "string",
				component: "dropdown",
				label: "Type",
				ref: "rType",
				options: [ 
					{ value: "a", label: $dict[lang].Inputbox }, 
					{ value: "b", label: $dict[lang].Select },
					{ value: "c", label: $dict[lang].Button }, 
					{ value: "d", label: $dict[lang].Slider},
					{ value: "e", label: $dict[lang].DatePicker}
				],
				change: function(data){
					switch (data.rType){
						case "a": data.sType = 's'; break;
					}
				},
				defaultValue: "a"
			},
			sliderType: {
				type: "string",
				component: "dropdown",
				label: $dict[lang].SliderType,
				ref: "sType",
				options: [
					{ value: "s", label: $dict[lang].SliderTypeA }, 
					{ value: "r", label: $dict[lang].SliderTypeB }
				],
				defaultValue: "s",
				show: function(data) {
					return data.rType === "d";
				}
			},
			outputType: {
				type: "string",
				component: "dropdown",
				label: "use Input for ",
				ref: "oType",
				options: [ 
					{ value: "v", label: $dict[lang].Variable }, 
					{ value: "f", label: $dict[lang].Field }
				],
				defaultValue: "v",
				change: function(data){
					data.oType === "v" ? data.useForMinMax = "a":  data.useForMinMax = "d";
						
				},
				show: function(data) {
					return (data.rType === "d" || data.rType === "e") && data.rType !== undefined;
				}
			},
			name: {
				ref: "var1",
				type: "string",
				component: "dropdown",
				label: $dict[lang].VariableName + " 1:",
				options: function () {
					return getVariableList().then( function ( items ) {
						return items;
					} );
				},
				change: function(data){
					 data.var1Value = data.var1Value || {};
                     data.var1Value.qStringExpression = '=' + data.var1;
				},
				show: function(data) {
					return data.oType === "v" || data.oType === undefined;
				}
			},
			namelabel1:{
				ref: "namelabel1",
				label: $dict[lang].NameLabel + ' 1',
				type: "string",
				expression: "optional",
				change: function(data) {
					
				},
				show: function(data) {
					return data.rType !== "c";
				}
			},
			name2: {
				ref: "var2",
				label: $dict[lang].VariableName +" 2:",
				type: "string",
				component: "dropdown",
				options: function () {
					return getVariableList().then( function ( items ) {
						return items;
					} );
				},
				change: function(data){
					 data.var2Value = data.var2Value || {};
                     data.var2Value.qStringExpression = '=' + data.var2;
				},
				show: function(data) {
					return (data.oType === "v" || data.oType === undefined)  && data.sType === 'r' ;
				}
			},
			namelabel2:{
				ref: "namelabel2",
				label: $dict[lang].NameLabel + ' 2',
				type: "string",
				expression: "optional",
				change: function(data) {
					
				},
				show: function(data) {
					return  data.sType === 'r' 
				}
			},
			field: {
				ref: "fName",
				label: $dict[lang].FieldName,
				type: "string",
				expression: "optional",
				change: function(data) {
					
				},
				show: function(data) {
					return data.oType === "f";
				}
			}
		}
	};
	
	var ValueSettings = {
		type: "items",
		label: $dict[lang].ValueSettings,
		show: function(data) {
			return data.rType === "b" || data.rType === "c";
		},
		items: {
			setValuesWith: {
				type: "string",
				component: "dropdown",
				label: $dict[lang].setValuesWith,
				ref: "setvalues",
				options: [{
					value: "f",
					label: $dict[lang].getFromField
				}, {
					value: "a",
					label: $dict[lang].setAlternative
				},
				{
					value: "c",
					label: $dict[lang].commaStr
				},
				{
					value: "o",
					label: $dict[lang].ownExpression
				}],
				defaultValue: "f"
			},
			
			concatfield: {
				ref: "concatField",
				label: $dict[lang].fieldNameForVal,
				type: "string",
				expression: "optional",
				change: function(data) {
					var sa = '';
					if(data.alwaysAllValues== true) {
						sa = '{1}'
					}
					data.fieldValues = data.fieldValues || {};
                    data.fieldValues.qStringExpression = "=concat(distinct " + sa + data.concatField +",',')";
				},
				show: function(data) {
					return data.setvalues === "f" || data.setvalues === undefined;
				}
			},
			alwaysAllValues: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].alwaysAllVal,
				ref: "alwaysAllValues",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
					var sa = '';
					if(data.alwaysAllValues== true) {
						sa = '{1}'
					}
					data.fieldValues = data.fieldValues || {};
                    data.fieldValues.qStringExpression = "=concat(" + sa + data.concatField +",',')";
					
				},
				defaultValue: true,
				show: function(data) {
					return data.setvalues === "f" || data.setvalues === undefined;
				}
			},
			varValueList: {
				type: "array",
				ref: "varvalues",
				label: $dict[lang].varValues,
				itemTitleRef: "label",
				allowAdd: true,
				allowRemove: true,
				addTranslation: $dict[lang].AddAlternative,
				items: {
					value: {
						type: "string",
						ref: "value",
						label: "Value",
						expression: "optional"
					},
					label: {
						type: "string",
						ref: "label",
						label: "Label",
						expression: "optional"
					}
				},
				show: function(data) {
					return data.setvalues === "a";
				}
			},
			valueString: {
				ref: "valStr",
				label: $dict[lang].commaSepStr,
				type: "string",
				change: function(data) {
					//console.log(data.valStr)
				},
				show: function(data) {
					return data.setvalues === "c";
				}
			}
		}
	};
	
	var SliderSettings = {
		type: "items",
		label: $dict[lang].SliderSettings,
		show: function(data) {
			return data.rType === "d";
		},
		items: {
			useForMinMax: {
				type: "string",
				component: "dropdown",
				label: $dict[lang].useForMinMax,
				ref: "useForMinMax",
				options: [{
					value: "a",
					label: $dict[lang].setMiMa
				},{
					value: "b",
					label: $dict[lang].getminff
				}, {
					value: "c",
					label: $dict[lang].getmaxff
				},
				{
					value: "d",
					label: $dict[lang].getmmff
				}],
				defaultValue: "a",
				show: function(data) {
					return data.oType === "f";
				}
			},
			allValuesMinMax: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].alwaysAllVal,
				ref: "allValuesMinMax",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				defaultValue: true,
				show: function(data) {
					return data.oType === "f" && data.useForMinMax !== "a";
				}
			},
			min: {
				ref: "min",
				label: "Min",
				type: "number",
				defaultValue: 0,
				expression: "optional",
				show: function(data) {
					return data.useForMinMax === "a" || data.useForMinMax === "c" || data.useForMinMax === undefined;
				}
			},
			max: {
				ref: "max",
				label: "Max",
				type: "number",
				defaultValue: 100,
				expression: "optional",
				show: function(data) {
					return data.useForMinMax === "a" || data.useForMinMax === "b" || data.useForMinMax === undefined;
				}
			},
			step: {
				ref: "step",
				label: $dict[lang].step,
				type: "number",
				defaultValue: 1,
				expression: "optional",
				show: function(data) {
					return data.oType !== "f";
				}
			},
			rangeLogic: {
				type: "string",
				component: "dropdown",
				label: "Range Logic",
				ref: "rangeLogic",
				options: [{
					value: "a",
					label: "> min < max"
				},{
					value: "b",
					label: ">= min < max"
				}, {
					value: "c",
					label: ">= min <= max"
				},
				{
					value: "d",
					label: "> min <= max"
				}],
				defaultValue: "a",
				show: function(data) {
					return data.sType === "r" && data.oType === "f";
				}
			},
			reverseSlider: {
				type: "boolean",
				component: "switch",
				label: "reverse Slider Logic",
				ref: "reverseSlider",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				defaultValue: true,
				show: function(data) {
					return data.oType === "f";
				}
			}
		}
	}
	
	var DatePickerSettings = {
		type: "items",
		label: $dict[lang].DatePickerSettings,
		show: function(data) {
			return data.rType === "e";
		},
		items: {
			dateformat: {
				type: "string",
				component: "dropdown",
				label: $dict[lang].dateformat,
				ref: "dateformat",
				options: [{
					value: "mm/dd/yy",
					label: "default (mm/dd/yy)"
				},
				{
					value: "yy-mm-dd",
					label: "ISO 8601 (yy-mm-dd)"
				},
				{
					value: "d M, y",
					label: "short (d M, y)"
				},
				{
					value: "d MM, y",
					label: "medium (d M, y)"
				},
				{
					value: "DD, d MM, yy",
					label: "Full - (DD, d MM, yy)"
				}],
				defaultValue: "mm/dd/yy"
			},
			multimonth: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].showmultimonth,
				ref: "multimonth",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				defaultValue: true
				
			},
			showButtonPanel: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].showButtonPanel,
				ref: "showButtonPanel",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				defaultValue: true
				
			},
			restrictDate: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].restrictDate,
				ref: "restrictdate",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				defaultValue: true
				
			},
			vrHelp: {
				label: $dict[lang].restrictSample,
				component: "text",
				show: function(data) {
					return data.restrictdate === true;
				}
			},
			rdMin: {
				ref: "rdMin",
				label: $dict[lang].rdMin,
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return data.restrictdate === true;
				}
			},
			rdMax: {
				ref: "rdMax",
				label: $dict[lang].rdMax,
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return data.restrictdate === true;
				}
			}
			
		}
	}
	
	var StyleSettings = {
		type: "items",
		label: $dict[lang].astyle,
		items: {
			showLabels: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].showLabels,
				ref: "showvarlabels",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				show: function(data) {
					return data.rType !== "c";
				},
				defaultValue: true
				
			},
			LabelsBold: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].showLabelsBold,
				ref: "labelsbold",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				show: function(data) {
					return data.showvarlabels === true;
				},
				defaultValue: true
				
			},
			ownWidth: {
				type: "boolean",
				component: "switch",
				label: $dict[lang].ownWidth,
				ref: "ownwidth",
				options: [{
					value: true,
					label: $dict[lang].On
				}, {
					value: false,
					label: $dict[lang].Off
				}],
				change: function(data) {
				
				},
				show: function(data) {
					return data.rType !== "c";
				},
				defaultValue: true
				
			},
			labelWidth: {
				ref: "labelwidth",
				label: $dict[lang].maxWidthLabel,
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return data.showvarlabels === true &&  data.ownwidth === true;
				}
			},
			objectWidth: {
				ref: "objectwidth",
				label: $dict[lang].objectWidth,
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return  data.ownwidth === true;
				}
			},
			
			styleType: {
				type: "string",
				component: "dropdown",
				label:  $dict[lang].styleType,
				ref: "styleType",
				options: [{
					value: "a",
					label: "Binom"
				},{
					value: "b",
					label: "Hexcodes"
				}],
				defaultValue: "a"
			},
			HighlightColorH: {
				ref: "HighlightColorH",
				label: "Highlight Background",
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return data.styleType === "b";
				}
			},
			HighlightFontColorH: {
				ref: "HighlightFontColorH",
				label: "Highlight Font",
				type: "string",
				change: function(data) {
				  
				},
				show: function(data) {
					return data.styleType === "b";
				}
			}
		}	
	};
	
	var HelpInfo = {
		type: "items",
		label: $dict[lang].info,
		items: {
			helpInfo: {
				type: "string",
				component: "radiobuttons",
				label: "binom Qlik Sense Input",
				ref: "helpInfo",
				options: [{
					value: "a",
					label: "about"
				}, {
					value: "h",
					label: "Help"
				}],
				defaultValue: "a"
			},
			MyText: {
				label:"Version: 1.0.0",
				component: "text",
				show: function(data) {
					return data.helpInfo !== "h";
				}
			},
			MyText2: {
				label:"Author: Thomas Lindackers",
				component: "text",
				show: function(data) {
					return data.helpInfo !== "h";
				}
			},
			MyText3: {
				label:"Private Project: not supported by Qlik",
				component: "text",
				show: function(data) {
					return data.helpInfo !== "h";
				}
			},
			MyLink: {
				label:"qlik.binom.net",
				component: "link",
				url:"http://qlik.binom.net/",
				show: function(data) {
					return data.helpInfo !== "h";
				}
			}
		}
	}
	
	var bnQSInputProps = {
		//type: "items", //<== not necessary to define "items"
		component: "expandable-items",
		label: "bnQSInput",
		items: {
			 bnQSInputSettings: MainSettings
			 , bnQSInputSlider: SliderSettings
			 , bnQSInputValues: ValueSettings
			 , bnQSDatePicker: DatePickerSettings
			 , bnQSInputStyle: StyleSettings
			 , bnQSInputHelp: HelpInfo
		}
	};
 
	var Settings = {
		uses: "settings",
		items: {
			general: {
				items: {
					showTitles: {
						defaultValue: false
					}
				}
			}
		}
	}
	return {
		
		type: "items",
		component: "accordion",
		items: {
			cSection: bnQSInputProps,
			settings: Settings
			
		}
	};

} );
