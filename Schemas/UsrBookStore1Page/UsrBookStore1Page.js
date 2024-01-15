define("UsrBookStore1Page", [], function() {
	return {
		entitySchemaName: "UsrBookStore",
		attributes: {
			
			"IsNew": {
				dataValueType: BPMSoft.DataValueType.BOOLEAN,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			  },
			"IsButtonVisible": {
				dataValueType: BPMSoft.DataValueType.BOOLEAN,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			  },
			"NumberOfRecords": {
				dataValueType: BPMSoft.DataValueType.INTEGER,
				type: BPMSoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: 0
			  }
			
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrBookStoreFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrBookStore"
				}
			},
			"UsrSchemad06fc1f6Detaild6b75557": {
				"schemaName": "UsrSchemad06fc1f6Detail",
				"entitySchemaName": "UsrRevisions",
				"filter": {
					"detailColumn": "UsrUsrBookStore",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrLookup1": {
				"ab347278-fd99-42d8-84f0-4978de6f8e61": {
					"uId": "ab347278-fd99-42d8-84f0-4978de6f8e61",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 7,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrInteger1"
							},
							"rightExpression": {
								"type": 0,
								"value": 300,
								"dataValueType": 4
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			
			save: function(){
			  //this.isNew - new card
			  this.set("IsNew",this.isNew);
			  this.callParent(arguments);
			  console.log('метод saved');		
			},

			onSaved: function() {
			  this.callParent(arguments);

			  console.log('метод onSaved');

			  if (this.get("IsNew")){
				console.log('Сохранили новую карточку: ' + this.get('Id'));
				this.addDetail(this, 0);
			  }else{
				 this.compldexAddDetail(this);
			  //	this.showNumberOfRecords(this)
			  }
			},
			showNumberOfRecords:function(thisObject) {
				thisObject.set("NumberOfRecords", 0);
				var esq = this.Ext.create(BPMSoft.EntitySchemaQuery, {
				  rootSchemaName: "UsrRevisions"
				});
				esq.addColumn("UsrUsrBookStore");
				var filters = this.Ext.create("BPMSoft.FilterGroup");
            filters.addItem(esq.createColumnFilterWithParameter(BPMSoft.ComparisonType.NOT_EQUAL, "UsrUsrBookStore",
              thisObject.get("Id")));
           		esq.filters = filters;
				esq.execute(function(response) {
					if (response.success) {
					  if (response.collection.collection) {
						  
                          var total = 0
                          var list  = []
                          var mega =  response.collection.collection.items

                          for (let i = 0; i< mega.length; i++){
                             if(!list.includes(mega[i].get("UsrUsrBookStore").value)){
                                 list.push(mega[i].get("UsrUsrBookStore").value)
                             }
                              
                          }
                          console.log(list)
                           debugger
                          for(var i = 0; i< list.length; i++){
                              var count = 0
							  for(var j = 0; j < mega.length; j++){
                                
                                if(list[i] === mega[j].get("UsrUsrBookStore").value){
                                    count++
                                }
                              }
                              if(count === 3){
                                  total++
                              }
                          }

							
							 BPMSoft.showInformation(
								Ext.String.format(
								thisObject.get("Resources.Strings.SuperMessage"),
								total.toLocaleString())

							);   
                          
                          
                          console.log(total)
                          console.log(response.collection.collection.items);
                      }}})
				
				
			},
			compldexAddDetail: function(thisObject) {
				var esq = this.Ext.create(BPMSoft.EntitySchemaQuery, {
				  rootSchemaName: "UsrRevisions"
				});
				esq.addColumn("UsrUsrBookStore");
            var filters = this.Ext.create("BPMSoft.FilterGroup");
            filters.addItem(esq.createColumnFilterWithParameter(BPMSoft.ComparisonType.EQUAL, "UsrUsrBookStore",
              thisObject.get("Id")));
           		esq.filters = filters;
            	thisObject.set("Count", 0);
				esq.execute(function(response) {
					debugger
				
					if (response.success) {
					  if (response.collection.collection) {
						  var count = response.collection.collection.items.length;
						  thisObject.set("Count", count);
						  console.log(count);
						  console.log(response.collection.collection.items);
						  
						  
						  if(thisObject.get("Count") > 3){
								thisObject.deleteAllDetails(thisObject);  
							    count = 1;
						  }else{
							  thisObject.addDetail(thisObject, thisObject.get("Count"));		  
						  	   count++;
						  }	 
						  
						  if(count === 3){
							  thisObject.showNumberOfRecords(thisObject)
						  }
					  }
					}
				}, this);
				
			},
			
			
			addDetail: function(thisObject, count) {
				var insert = Ext.create('BPMSoft.InsertQuery', {
                  rootSchemaName: 'UsrRevisions'
                });
                insert.setParameterValue('Id', "",
                  BPMSoft.DataValueType.GUID);
insert.setParameterValue('UsrName', "AutoGenerated " + count,
                  BPMSoft.DataValueType.TEXT);

insert.setParameterValue('UsrUsrBookStore', thisObject.get("Id"),
                  BPMSoft.DataValueType.GUID);
                insert.execute();
				console.log("addDetail");
				
			},
			deleteAllDetails: function(thisObject) {
				console.log("deleteAllDetails")
				var query1 = Ext.create("BPMSoft.DeleteQuery", {
				  rootSchemaName: 'UsrRevisions'
				});

			var filter = BPMSoft.createColumnFilterWithParameter(BPMSoft.ComparisonType.EQUAL, "UsrUsrBookStore", thisObject.get("Id"));
			query1.filters.addItem(filter);

			query1.execute( function(response){
				thisObject.addDetail(thisObject, thisObject.get("Count"));
			});

				 
			},
			
			hideButton: function(){
				debugger;
			  this.set("IsButtonVisible",false);
				console.log(this.get("VisibleButton1"));
				console.log(this);
			  console.log('метод hideButton');
			},
			showButton: function(){
				debugger;
			  this.set("IsButtonVisible",true);
			  console.log('метод showButton');
			},
			 getActionVisible: function(){
				 
				return true;
			  },
			getActions: function() {
				
				/* Вызов базовой реализации метода для получения проиниализированных действий страницы. */
				var actions = this.callParent(arguments);
				/* Добавление линии-разделителя между вкладками действий. */
				actions.addItem(this.getButtonMenuItem({
					Type: "BPMSoft.MenuSeparator",
					Caption: ""
				}));
				/* Добавление кастомного пункта в список действий. */
				actions.addItem(this.getButtonMenuItem({
					/* Привязка заголовка действия к локализуемой строке. */
					"Tag": "myActionClick",
					"Caption": {"bindTo": "Resources.Strings.MyActionCaption"},
					"Visible": {"bindTo": "getActionVisible"},
					"Click" : {"bindTo": "myActionClick"}
				}));
				/* Возвращение коллекции действий страницы. */
				return actions;
			},
			 myActionClick: function(){
				 this.showButton();
      
			  },
			 myButtonClick: function(){
				 this.hideButton();
            	
				 BPMSoft.showInformation(
					Ext.String.format(
					this.get("Resources.Strings.MyActionMessage"),
					new Date().toLocaleString())

				);   
				
				return true;

			  },

			
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				/* Выполняется операция добавления элемента на страницу. */
				"operation": "insert",
				/* Наименование родительского контейнера, в который добавляется кнопка. */
				"parentName": "LeftContainer",
				/* Кнопка добавляется в коллекцию элементов родительского элемента. */
				"propertyName": "items",
				/* Наименование кнопки. */
				"name": "VisibleButton1",
				"values": {
					/* Тип добавляемого элемента — кнопка. */
					"itemType": BPMSoft.ViewItemType.BUTTON,
					/* Привязка заголовка кнопки к локализуемой строке схемы. */
					"caption": { bindTo: "Resources.Strings.MyButtonCaption" },
					/* Привязка обработчика события нажатия кнопки. */
					"click": { bindTo: "myButtonClick" },
					/* Привязка свойства доступности кнопки. */
					"visible":  { bindTo: "IsButtonVisible" },
					/* Стиль отображения кнопки. */
					"style": BPMSoft.controls.ButtonEnums.style.DEFAULT,
				   /* Настройка расположения кнопки. */
					 "layout": {
				   /* Номер колонки. */
						 "column": 13, 
				   /* Номер строки. */
						 "rowSpan": 2, 
				   /* Количество занимаемых колонок. */
						 "colSpan": 30,
						"layoutName": "ProfileContainer"
					 }
				}
			  },
			
			{
				"operation": "insert",
				"name": "Tabe08097ccTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tabe08097ccTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tabe08097ccTabLabelGroup61e34ac3",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tabe08097ccTabLabelGroup61e34ac3GroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "Tabe08097ccTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tabe08097ccTabLabelGridLayoutb59b9e67",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "Tabe08097ccTabLabelGroup61e34ac3",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrName07900865-8988-4067-8cd9-43e876e5f3d6",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Tabe08097ccTabLabelGridLayoutb59b9e67"
					},
					"bindTo": "UsrName"
				},
				"parentName": "Tabe08097ccTabLabelGridLayoutb59b9e67",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrDatetime1b32b2f1b-b0aa-49b8-a85d-7cc14271bda8",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Tabe08097ccTabLabelGridLayoutb59b9e67"
					},
					"bindTo": "UsrDatetime1"
				},
				"parentName": "Tabe08097ccTabLabelGridLayoutb59b9e67",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "UsrLookup26cf56b35-5e3c-42a9-944b-a6db50a02f3b",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Tabe08097ccTabLabelGridLayoutb59b9e67"
					},
					"bindTo": "UsrLookup2"
				},
				"parentName": "Tabe08097ccTabLabelGridLayoutb59b9e67",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrNetworkType40d33575-dd2d-48ad-982a-a0e30225f13c",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "Tabe08097ccTabLabelGridLayoutb59b9e67"
					},
					"bindTo": "UsrNetworkType"
				},
				"parentName": "Tabe08097ccTabLabelGridLayoutb59b9e67",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Tab11d68a27TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab11d68a27TabLabelTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Tab11d68a27TabLabelGroupa3e94f10",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab11d68a27TabLabelGroupa3e94f10GroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "Tab11d68a27TabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Tab11d68a27TabLabelGridLayout53365d1f",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "Tab11d68a27TabLabelGroupa3e94f10",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrInteger1f589dacb-c373-4e1d-b2ce-88bc18d3254a",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Tab11d68a27TabLabelGridLayout53365d1f"
					},
					"bindTo": "UsrInteger1"
				},
				"parentName": "Tab11d68a27TabLabelGridLayout53365d1f",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrLookup1367cab01-2586-41c7-a719-1a0dac833b71",
				"values": {
					"layout": {
						"colSpan": 11,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Tab11d68a27TabLabelGridLayout53365d1f"
					},
					"bindTo": "UsrLookup1"
				},
				"parentName": "Tab11d68a27TabLabelGridLayout53365d1f",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 2
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrSchemad06fc1f6Detaild6b75557",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 3
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
