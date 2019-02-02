exports.up = function(knex, Promise) {
  return knex.schema
  .table('options', function(table) {
    table.dropColumn('dates');
  })
  .table('options', function(table) {
    table.specificType('dates', 'text ARRAY');
  })
  .table('responses', function(table) {
    table.dropColumn('dates');
  })
  .table('responses', function(table) {
    table.specificType('dates', 'integer ARRAY');    
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
  .table('options', function(table) {
    table.dropColumn('dates');
  })
  .table('options', function(table) {
    table.string('dates');    
  })
  .table('responses', function(table) {
    table.dropColumn('dates');
  })
  .table('responses', function(table) {
    table.string('dates');        
  })
};
