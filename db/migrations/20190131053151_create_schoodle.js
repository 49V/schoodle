
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('organizers', function (table) {
        table.increments('id').primary();
        table.string('name');
        table.string('email');
    })
    .createTable('events', function (table) {
        table.string('hashed_url').primary();
        table.string('name');
        table.string('description');
        table.string('location');
        table.integer('organizers_id').references('id').inTable('organizers');
    })
    .createTable('responses', function (table) {
        table.increments('id').primary();
        table.string('attendee_name');
        table.string('attendee_email');
        table.string('dates');
        table.string('events_id').references('hashed_url').inTable('events');
    })
    .createTable('options', function (table) {
        table.increments('id').primary();
        table.string('dates');
        table.string('events_id').references('hashed_url').inTable('events');
    })
    .createTable('options_responses', function (table) {
        table.integer('responses_id').references('id').inTable('responses');
        table.integer('options_id').references('id').inTable('options');
    });
  
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTable('options_responses')
    .dropTable('options')
    .dropTable('responses')
    .dropTable('events')
    .dropTable('organizers');
};
