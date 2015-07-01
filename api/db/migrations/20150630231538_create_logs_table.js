var create_logs_table = new Migration({
	up: function() {
		this.create_table('logs', function(t) {
			t.timestamp('timestamp');
			t.integer('memberId');
			t.integer('cardId');
		});

		this.execute("insert into logs (timestamp, memberId, cardId) values ('1990-01-01 10:00:00', 1, 1);");
	},
	down: function() {
    this.drop_table('logs');
	}
});
