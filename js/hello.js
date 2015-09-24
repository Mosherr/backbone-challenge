(function ($) {

	Backbone.sync = function (method, model, success, error) {
		success.success();
	}
	
	var Product = Backbone.Model.extend({
		defaults:{
			id: null,
			name: '',
			description: '',
			cost: null,
			retail: null			
		}
	});

	var ProductList = Backbone.Collection.extend({
		model: Product
	});

	var ProductView = Backbone.View.extend({
		tagName: 'li', //name of (orphan) root tag in this.el
		
		events:{
			'click span.edit': 'edit',
			'click span.delete': 'remove'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'unrender', 'edit', 'remove'); //every function that uses 'this' as the current object should be in here
			
			this.model.bind('change', this.render);
			this.model.bind('remove', this.unrender);
		},
		
		render: function(){
			$(this.el).html('<span style="color:black;">'+this.model.get('name')+' '+this.model.get('description')+'</span> &nbsp; &nbsp;'+ 
					'<span class="edit" style="font-family:sans-serif; color:blue; cursor:pointer;">[edit]</span>'+
					'<span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
			return this; // for chainable calls, like .render().el
		},
		
		unrender: function(){
			$(this.el).remove();
		},
		
		edit: function(){

		},
		
		remove: function(){
			this.model.destroy();
		}
	});
	
	var EditProductView = Backbone.View.extend({		
		events:{
			'click button#submit': 'submit',
			'click button#cancel': 'cancel'
		},
		
		initialize: function(options){
			_.bindAll(this, 'render', 'cancel', 'submit'); // every function that uses 'this' as the current object should be in here
			
			if (options.model) {
				this.model = options.model;
				this.model.bind('cancel', this.unrender);
			}
			
			this.collection = options.collection;
			this.el = options.el;
			this.render();
		},
		
		render: function(){
			$(this.el).html(
				'<form>'+
				'Name: <input type="text" name="name"><br>'+
				'Description: <input type="text" name="description"><br>'+
				'Cost: <input type="text" name="cost"><br>'+
				'Retail: <input type="text" name="retail"><br><br>'+
				'<button id="submit">Submit</button>'+
				'<button id="cancel">Cancel</button>'+
				'</form>'
			);
		},
		
		show: function () {			
			$(this.el).show();	
		},
		
		hide: function () {
			$(this.el).hide();	
		},
		
		cancel: function() {
			e.preventDefault();
			this.hide();
			this.render();
		},
		
		submit: function(e) {
			e.preventDefault();
			var product = new Product({
				id: this.collection.length+1,
				name: $("input[name=name]").val(),
				description: $("input[name=description]").val(),
				cost: $("input[name=cost]").val(),
				retail: $("input[name=retail]").val()
			});
			this.collection.add(product);
			this.render();
			this.hide();
		}
	});

	var ProductListView = Backbone.View.extend({    
		el: $('body'), // attaches `this.el` to an existing element.		
		
		events:{
			'click button#add': 'addProduct'
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'addProduct', 'appendProduct'); // every function that uses 'this' as the current object should be in here
			 
			 this.collection = new ProductList();
			 this.collection.bind('add',this.appendProduct);						 
					 
			 this.render(); // not all views are self-rendering. This one is.
		},
		
		render: function(){
			var self = this;			
			$(this.el).append("<button id='add'>Add Product</button>");
			$(this.el).append("<div id='edit'></div>");
			$(this.el).append("<ul></ul>");
			_(this.collection.models).each(
				function(product){ //in case collection is not empty
					self.appendProduct(product);
				},
			this);
				
			this.editProduct = new EditProductView({el: '#edit', collection: this.collection});		
			$('#edit',this.el).append(this.editProduct);
			this.editProduct.hide();
		},
		
		addProduct: function(){					
			this.editProduct.show();
		},
		
		appendProduct: function(product){
			var productView = new ProductView({
				model:product
			});
			$('ul',this.el).append(productView.render().el);
		}		
	  });
	
	  // **listView instance**: Instantiate main app view.
	  var productListView = new ProductListView();      
})(jQuery);