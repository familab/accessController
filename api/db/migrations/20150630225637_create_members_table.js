var create_members_table = new Migration({
	up: function() {
		this.create_table('members', function(t) {
			t.string('name');
			t.string('email');
			t.boolean('enabled');
		});

		this.execute("insert into members (name, email, enabled) values ('John Doe', 'jon@familab.org', 1);");
	},
	down: function() {
    this.drop_table('members');
	}
});
