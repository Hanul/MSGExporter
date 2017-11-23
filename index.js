module.exports = (sourceFolderPath, saveFilePath) => {
	
	let Path = require('path');
	
	let sentences = [];
	
	let find = (path) => {
		
		READ_FILE({
			path : path,
			isSync : true
		}, (content) => {
			content = content.toString();
			
			let length = content.length;
			let i, j, blockLevel, startIndex;
			
			for (i = 5; i < length; i += 1) {
				if (content.substring(i - 5, i) === 'MSG({') {
					
					tabCount = 0;
					startIndex = -1;
					for (j = i; j < length; j += 1) {
						if (content.substring(j - 5, j) === 'ko : ') {
							startIndex = j;
							for (let k = j; k >= 0; k -= 1) {
								if (content[k] === '\n') {
									break;
								}
								if (content[k] === '\t') {
									tabCount += 1;
								}
							}
						} else if (startIndex !== -1 && (content[j] === '\r' || content[j] === '\n')) {
							sentences.push(content.substring(startIndex, j).replace(/\r/g, '').replace(/\n/g, '\\n').replace(/\t/g, '\\t'));
							break;
						}
					}
				}
			}
		});
	};
	
	let scan = (path) => {
	
		FIND_FILE_NAMES({
			path : path,
			isSync : true
		}, (fileNames) => {
			EACH(fileNames, (fileName) => {
				find(path + '/' + fileName);
			});
		});
	
		FIND_FOLDER_NAMES({
			path : path,
			isSync : true
		}, (folderNames) => {
			EACH(folderNames, (folderName) => {
				scan(path + '/' + folderName);
			});
		});
	};
	
	scan(sourceFolderPath);
	
	let content = '';
	
	if (Path.extname(saveFilePath) === '.csv') {
		EACH(sentences, (sentence, i) => {
			content += 'SENTENCE_' + i + ',"' + sentence.replace(/"/g, '""') + '"\n';
		});
	} else {
		EACH(sentences, (sentence, i) => {
			content += sentence + '\n';
		});
	}
	
	WRITE_FILE({
		path : saveFilePath,
		content : content
	}, () => {
		console.log('추출 완료');
	});
};