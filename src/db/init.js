var sync = require('./sync.js');
var db = sync.db;

sync.promise.then(function () {
  db.User.bulkCreate([
    {firstName: 'Patrick', lastName: 'Hulce', access: 'user'},
    {firstName: 'Megan', lastName: 'Hulce', access: 'user'},
    {firstName: 'James', lastName: 'Hulce', access: 'user'},
    {firstName: 'Kate', lastName: 'Hulce', access: 'user'},
    {firstName: 'Tom', lastName: 'Hulce', access: 'user'}
  ]);
});
