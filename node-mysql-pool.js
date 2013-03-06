/** 
 * MySQL pool to hold multiple connections to the database server
 *
 * @author	Martin Lantzsch <martin@linux-doku.de>
 * @website http://github.com/LinuxDoku/node-mysql-pool
 */

var mysql = require('mysql');
module.exports = function(config) {
	this.freeConnections = [];
	this.queryQueue = [];

	this.createConnection = function(details) {
		var connection = mysql.createConnection(details);
		connection.connect();
		connection.number = this.freeConnections.length;
		this.freeConnections.push(connection);
	};

	this.query = function(command, params, callback) {
		if(typeof(params) == 'function') {
			callback = params;
			params = [];
		}

		this.queryQueue.push({
			command: command,
			params: params,
			callback: callback
		});
		this.work();
	};

	this.work = function() {
		var self = this;
		if(self.queryQueue.length > 0) {
			if(self.freeConnections.length > 0) {
				var query = self.queryQueue.shift();
				var connection = self.freeConnections.shift();
				connection.query(query.command, query.params, function(err, results) {
					if(err) throw err;
					query.callback(err, results);
					self.freeConnections.push(connection);
					if(self.queryQueue.length > 0)
						self.work();
				});
			}
		}
	};

	for(i = 0; i < config.poolsize; i++) {
		this.createConnection(config.mysql);
	}

	return this;
};