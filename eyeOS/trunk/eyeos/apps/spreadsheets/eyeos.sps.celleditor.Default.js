/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


qx.Class.define('eyeos.sps.celleditor.Default', {
	
	extend: qx.ui.table.celleditor.TextField,

	construct : function() {
		this.base(arguments);
	},

	members: {
		createCellEditor : function(cellInfo)
		{
			var cellEditor = new qx.ui.form.TextField;
			cellEditor.setAppearance("table-editor-textfield");

			cellEditor.originalValue = cellInfo.value;
			if ( cellInfo.value === null || cellInfo.value === undefined || cellInfo.value.toString() == 'NaN') {
				cellInfo.value = "";
			}
			cellEditor.setValue("" + cellInfo.value);

//			var tinymceId = 'tinymce_editor' + Math.round(Math.random() * (3*1000));
//			cellEditor.ed = new tinymce.Editor(tinymceId, {
//				//strict_loading_mode : true,
//				theme: 'advanced'
//			});

			cellEditor.selectAllText();


//			cellEditor.addListener('appear', function () {
//				this.getContentElement().getDomElement().setAttribute('id', 'tinymce_editor_sps');
//				tinyMCE.execCommand('mceAddControl', false, 'tinymce_editor_sps');
//
////				tinyMCE.EditorManager.get('tinymce_editor_sps').onDeactivate.add(function (ed, e) {
////					console.log('tu puta madre');
////				});
////				if (e.getKeyIdentifier() == 'Enter') {
////					console.log('angel negro');
////					this.setValue(tinyMCE.activeEditor.getContent());
////					tinyMCE.execCommand('mceRemoveControl', false, 'tinymce_editor_sps');
////					this.getContentElement().getDomElement().setAttribute('id', '');
////				}
////			});
//			});
//
//			cellEditor.addListener('disappear', function () {
//				tinyMCE.execCommand('mceRemoveControl', false, 'tinymce_editor_sps');
//			});

			
			
			
//			cellEditor.addListener("appear", function() {
//				this.getContentElement().getDomElement().setAttribute('id', tinymceId);
////				this.ed.render();
//				cellEditor.selectAllText();
//				var tinymceId = 'tinymce_editor' + Math.round(Math.random() * 100 + 1);
//				this.setUserData('id', tinymceId);
//				this.getContentElement().getDomElement().setAttribute('id', tinymceId);
//				ed = new tinymce.Editor(tinymceId, {
//					strict_loading_mode : true,
//					theme: 'advanced',
//					theme_advanced_buttons1 : "",
//					theme_advanced_buttons2 : "",
//					theme_advanced_buttons3 : "",
//					setup : function(ed) {
//						ed.onPostRender.add(function(ed) {
//							var editor = document.getElementById(ed.id + '_tbl').firstChild;
//							editor.lastChild.style.dispay = 'none';
//						});
//					}
//				});
//
//				ed.render();
//				this.ed = ed;
//			});
//
//			cellEditor.addListener('keypress', function (e) {
//				if (e.getKeyIdentifier() == 'Enter') {
//					tinyMCE.execCommand('mceRemoveControl', false, this.getUserData('id'));
//				}
//			});
//
//			cellEditor.addListener('disappear', function () {
//				this.ed.destroy();
//			})

			return cellEditor;
		},
		
		getCellEditorValue : function(cellEditor)
		{
			var value = cellEditor.getValue();

			// validation function will be called with new and old value
			var validationFunc = this.getValidationFunction();
			if ( ! this.__done && validationFunc )
			{
				value = validationFunc( value, cellEditor.originalValue );
				this.__done = true;
			}

//			if (typeof cellEditor.originalValue == "number") {
//				value = parseFloat(value);
//			}

			return value;
		}
	}
});