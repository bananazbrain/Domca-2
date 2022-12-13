const PATH    = require('./node/path.js');
const Creator = require('./node/creator.js');
const Watcher = require('./node/watcher.js');

var fs = require('fs');

var argv = {
	flag: process.argv[2],
	list: process.argv.slice(3)
}

if (process.argv.length > 1) {
	switch (argv.flag){
		case '-cb':
			var fileBlocks = PATH.PUG + 'blocks.txt';
			for (let item of argv.list) {
				var name = item;
				new Creator(name, PATH.BLOCKS, ['.sass', '.pug', '.js'], {true: `Блок ${name} успешно создан`, false: `Блок ${name} уже имеется`})
				var blocks = fs.readFileSync(fileBlocks);
				fs.writeFileSync(fileBlocks, blocks + `//- ${item} \n+style('${item}', 'blocks')\ninclude ../../blocks/${item}/${item}\n\n`);
			}	
			break;
		case '-cc':
			for (let item of argv.list) {
				var name = item.replace(/[\W\d]/g,'')
				new Creator(name, PATH.COMPS, ['.sass', '.pug', '.js'], {true: `Компонент ${name} успешно создан`, false: `Компонент ${name} уже имеется`})				
			}	
			break;
		case '-cp':
			for (let item of argv.list) {
				var name = item;
				new Creator(name, PATH.PAGES, ['.pug'], {true: `Страница ${name} успешно создан`, false: `Страница ${name} уже имеется`})				
				var opn = require('opn');
				opn('localhost:3000/' + name + '.html');
			}	
			break;
		case '-w':
			new Watcher();
			break;
		case '-ww':
			Watcher.compilePages();
			break;
	}
}