# node-mysql-pool
## General
Using the node-mysql module [node-mysql](https://github.com/felixge/node-mysql) in will be a bottleneck on high traffic sites, because it only uses one mysql connection and runs the queries synchronously over this single connection. This module is build ontop of the mysql module and offers an pool of multiple connections, which will be automatically choosen and used.

## Configuration
After downloading and placing the module, you can load it via "require('/path/to/the/module')". The constructor accepts an json object with two parameters.

* **poolsize** how many connections to the database should be used (and hold!)
* **mysql** normal mysql configuration (see [node-mysql](https://github.com/felixge/node-mysql))

```
var pool = new require('/helpers/pool')({
	poolsize: 50,
	mysql: {
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'resigame'
	}
});
```

## Using
Now you can fire all your mysql querys to the new pool object. Cause it's only a wrapper for the node-mysql module, it's the same using behaviour (see [node-mysql](https://github.com/felixge/node-mysql)).

```
pool.query('SELECT * FROM users WHERE userID = ?', [userID], function(err, results) {
	// whatever
});
```

## Background Information

* The config parameter poolsize is not allowed to be greater than the mysql "max_connections" system variable. Else you will become an "Too many connections" error.
* When setting the poolsize you should reserve some left connections for you to administer the database with tools like phpMyAdmin, MySQL Workbench, whatever.