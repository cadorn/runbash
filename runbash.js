

module.exports = function (commands, options) {

	if (typeof commands === "string") {
		commands = [ commands ];
	}

	const Promise = require("bluebird");

	return Promise.promisify(function (_callback) {

		const CHILD_PROCESS = require("child_process");


		function callback (err) {
			if (!_callback) {
				console.error("ERROR: Got error after already returning once:", err.stack);
				return;
			}
			return _callback.apply(null, arguments);
		}

	    options = options || {}


		// Reset bash.origin loaded variables
		var extraVars = [
				'export BO_LOADED=',
				'export BO_IS_SOURCING=',
				'export BO_sourceProfile__sourced='
		];

		if (options.verbose) {
				extraVars = extraVars.concat([
						'export BO_VERBOSE=1'
				]);
		}

		commands = commands.concat(extraVars);

		if (options.wrappers) {
		    if (options.wrappers["bash.origin"]) {
		        commands = extraVars.concat([
                '. "' + require.resolve("bash.origin/bash.origin") + '"',
                'function init {',
                '	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"',
                '	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"',
                '	local __BO_DIR__="$___TMP___"'
		        ].concat(commands).concat([
                '}',
                'init $@'
            ]));
		    }
		}

		if (options.verbose) {
			console.log("[runbash] Running commands:", commands);
		}


		// TODO: Put this into utility module/package.
		function getProcesses (callback) {

			var processes = {
				byPid: {},
			};
			var columns;

			function makeRow (columns, fields) {
				var row = {};
				fields.forEach(function (field, index) {
					if (columns[index]) {
						row[columns[index]] = field;
					} else {
						row[columns[columns.length - 1]] += " " + field;
					}
				});
				return row;
			}

			var proc = CHILD_PROCESS.spawn("bash");
			proc.stderr.on('data', function (data) {
			  console.log('stderr: ' + data);
			});
			var buffer = [];
			proc.stdout.on('data', function (data) {
				buffer.push(data.toString());
			});
			proc.on('close', function (code) {
				if (code !== 0) {
					return callback(new Error("Process exit status != 0"));
				}
				columns = null;
				buffer.join("").split("\n").forEach(function (line) {
					if (!line) return;
					var fields = line.replace(/[\t\s]+/g, " ").replace(/(^\s|\s$)/g, "").split(/\s/);

					if (fields[0] === "PPID" || fields[0] === "USER") {
						columns = fields;
					} else {
						// @see http://www.cs.miami.edu/~geoff/Courses/CSC521-04F/Content/UNIXProgramming/UNIXProcesses.shtml
						// @see http://chinkisingh.com/2012/06/10/session-foreground-processes-background-processes-and-their-interaction-with-controlling-terminal/
						var process = makeRow(columns, fields);
						// process.PID - Process ID
						// process.PPID - Parent process ID
						// process.PGID - Parent group ID
						// process.SID - Session leader ID
						// process.TPGID - Terminal process group ID
						// process.TTY - (TeleTYpewriter) The terminal that executed a particular command ; @see http://stackoverflow.com/a/7113800/330439
						// process.STAT - Process state ; @see http://unix.stackexchange.com/a/18477/92833
						//	 states:
						//		D Uninterruptible sleep (usually IO)
						//		R Running or runnable (on run queue)
						//		S Interruptible sleep (waiting for an event to complete)
						//		T Stopped, either by a job control signal or because it is being traced.
						//		W paging (not valid since the 2.6.xx kernel)
						//		X dead (should never be seen)
						//		Z Defunct ("zombie") process, terminated but not reaped by its parent.
						//   flags:
						//		< high-priority (not nice to other users)
						//		N low-priority (nice to other users)
						//		L has pages locked into memory (for real-time and custom IO)
						//		s is a session leader
						//		l is multi-threaded (using CLONE_THREAD, like NPTL pthreads do)
						//		+ is in the foreground process group
						// process.UID - User ID ; @see http://stackoverflow.com/a/205146/330439
						// process.START - Indication of how long the process has been up
						// process.TIME - Accumulated CPU utilization time ; @see http://www.theunixschool.com/2012/09/ps-command-what-does-time-indicate.html
						// process.USER - Username of PID
						// process.COMMAND - The command being executed
						// process.%CPU - % of current total CPU utilization
						// process.%MEM - % of current total MEM utilization
						// process.VSZ - (Virtual Memory Size) Accessible memory including swap and shared lib ; @see http://stackoverflow.com/a/21049737/330439
						// process.RSS - (Resident Set Size) Allocated ram ; @see http://stackoverflow.com/a/21049737/330439

						if (!processes.byPid[process.PID]) {
							processes.byPid[process.PID] = {};
						}
						if (!processes.byPid[process.PID].info) {
							processes.byPid[process.PID].info = {};
						}
						for (var name in process) {
							if (typeof processes.byPid[process.PID].info[name] === "undefined") {
								processes.byPid[process.PID].info[name] = process[name];
							}
						}

						if (process.PPID) {
							if (!processes.byPid[process.PPID]) {
								processes.byPid[process.PPID] = {};
							}
							if (!processes.byPid[process.PPID].children) {
								processes.byPid[process.PPID].children = [];
							}
							if (processes.byPid[process.PPID].children.indexOf(process.PID) === -1) {
								processes.byPid[process.PPID].children.push(process.PID);
							}
						}

					}
				});

				return callback(null, processes)
			});
			proc.stdin.write("ps axo ppid,pid,command");
			return proc.stdin.end();
		}

		function killPIDs (pids, callback) {
			var command = "kill " + pids.join(" ");
			if (options.verbose) console.log("Run: " + command);
			return CHILD_PROCESS.exec(command, function (err, stdout, stderr) {
				if (stdout) process.stdout.write(stdout);
				if (stderr) process.stderr.write(stderr);
				if (err) {
					return callback(/* purposely not returning error */);
				}
				return callback();
			});
		}




	    var proc = CHILD_PROCESS.spawn("bash", [
	        "-e",
	        "-s"
	    ], options);
	    proc.on("error", function(err) {
	    	return callback(err);
	    });
	    var stdout = [];
	    var stderr = [];

	    function formatEscapeCodes (data) {
	    	return data;
	    }

	    proc.stdout.on('data', function (data) {
		    	stdout.push(data.toString());
					if (options.verbose || options.progress) process.stdout.write(formatEscapeCodes(data.toString()));
	    });
	    proc.stderr.on('data', function (data) {
	    		stderr.push(data.toString());
					if (options.verbose || options.progress) process.stderr.write(formatEscapeCodes(data.toString()));
	    });
	    proc.stdin.write(commands.join("\n"));
	    proc.stdin.end();
	    proc.on('close', function (code) {
	    	if (code) {
	    		var err = new Error("Commands exited with code: " + code);
	    		err.code = code;
	    		err.stdout = stdout;
	    		err.stderr = stderr;
	    		console.error("err", err);
	    		return callback(err);
	    	}
	    	stdout = stdout.join("");
	    	var exports = {};
	    	if (options.exports) {
                var re = /^([^:\s]+):\s?(.*?)$/gm;
				var m;
				while ( (m = re.exec(stdout)) ) {
				    if (options.exports[m[1]]) {
				        exports[m[1]] = m[2];
				    }
				}
	    	}
	        return callback(null, {
				code: 0,
	            stdout: stdout,
	            stderr: stderr.join(""),
	            exports: exports
	        });
	    });
	    if (options.wait === false) {
	    	return callback(null, {
	    		process: proc,
	    		killDeep: function () {					
					return Promise.promisify(function (callback) {
						return getProcesses(function (err, processes) {
							if (err) return callback(err);
							var pids = [];
							pids.push(proc.pid);
							function traverse (node) {
								if (
									node &&
									node.children &&
									node.children.length > 0
								) {
									node.children.forEach(function (pid) {
										pids.push(pid);
										return traverse(processes.byPid[""+pid]);
									});
								}
							}
							traverse(processes.byPid[""+proc.pid]);
							pids.reverse();
							return killPIDs(pids, callback);
						});
	    			})();
	    		}
	    	});
	    }
	})();
}
