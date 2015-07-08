var create_logs_table = new Migration({
	up: function() {
		this.create_table('logs', function(t) {
			t.timestamp('timestamp');
			t.string('uid');
			t.boolean('allowed');
		});

		this.execute("insert into logs (timestamp, uid, allowed) values ('1990-01-01 10:00:00', 'EF432DE', 1);");
	},
	down: function() {
    this.drop_table('logs');
	}
});
