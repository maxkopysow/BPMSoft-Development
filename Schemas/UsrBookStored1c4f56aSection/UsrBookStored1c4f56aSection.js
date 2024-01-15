define("UsrBookStored1c4f56aSection", [], function() {
	return {
             /**
             * Наименование объекта. 
             */
             entitySchemaName: "UsrBookStore",
             /**
             * Метод обработчик доступности кнопки.
             */
             methods: {
                  getActionVisible: function(){
					
				return true;
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
             /** 
             * Конфигурация визуального отображения элементов интерфейса. 
             */
             diff: /**SCHEMA_DIFF*/[
                   /* Метаданные добавления кнопки. */
				 
				 {
				/* Выполняется операция добавления элемента на страницу. */
				"operation": "insert",
				/* Наименование родительского контейнера, в который добавляется кнопка. */
				"parentName": "CombinedModeActionButtonsCardLeftContainer",
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
                
             ]/**SCHEMA_DIFF*/
       };
 });