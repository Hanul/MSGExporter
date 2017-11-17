#!/usr/bin/env node

require('uppercase-core');

RUN(() => {
	
	let Program = require('commander');
	let MSGExporter = require('./index.js');
	
	let packageInfo = PARSE_STR(READ_FILE({
		path : __dirname + '/package.json',
		isSync : true
	}).toString());
	
	Program
		.version(packageInfo.version)
		.arguments('<sourceFolderPath> <saveFilePath>')
		.action(MSGExporter);
	
	Program.parse(process.argv);
});

