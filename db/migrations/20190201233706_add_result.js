
exports.up = function(knex, Promise) {
    return knex.schema.table('events', function(t) {
        t.text('final_date');
    });
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('events', function(t) {
        t.dropColumn('final_date');
    });
};

