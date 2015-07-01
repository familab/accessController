var create_logs_table = new Migration({
	up: function() {
		this.create_table('logs', function(t) {
			t.integer('id');
			t.timestamp('timestamp');
			t.integer('memberId');
			t.integer('cardId');
			t.primary_key('id');
		});
	},
	down: function() {
    this.drop_table('logs');
	}
});
