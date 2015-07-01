var create_cards_table = new Migration({
	up: function() {
		this.create_table('cards', function(t) {
			t.string('uid');
			t.integer('memberId');
			t.boolean('enabled');
			t.index('uid');
		});

		this.execute("insert into cards (uid, memberId, enabled) values ('4F33A2', 1, 1);");
	},
	down: function() {
    this.drop_table('cards');
	}
});
