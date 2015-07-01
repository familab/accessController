var create_cards_table = new Migration({
	up: function() {
		this.create_table('cards', function(t) {
			t.integer('id');
			t.string('uid');
			t.boolean('enable');
			t.primary_key('id');
		});
	},
	down: function() {
    this.drop_table('cards');
	}
});
