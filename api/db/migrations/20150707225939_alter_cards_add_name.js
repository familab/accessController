var alter_cards_add_name = new Migration({
	up: function() {
	  this.add_column('cards', 'name', 'string')
  },
	down: function() {
	  this.remove_column('cards', 'name')
	}
});
