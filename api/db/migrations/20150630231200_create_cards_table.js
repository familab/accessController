var create_cards_table = new Migration({
	up: function() {
		this.create_table('cards', function(t) {
			t.integer('id');
			t.string('uid');
			t.integer('memberId');
			t.boolean('enable');
			t.primary_key('id');
			t.index('uid');
		});
	},
	down: function() {
    this.drop_table('cards');
	}
});
