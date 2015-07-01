var create_members_table = new Migration({
	up: function() {
		this.create_table('members', function(t) {
			t.integer('id');
			t.string('name');
			t.string('email');
			t.boolean('enable');
			t.primary_key('id');
		});
	},
	down: function() {
    this.drop_table('members');
	}
});
