const pug         = require('pug');
const sass        = require('sass');
const browserSync = require('browser-sync').create();
const cleanHTML   = require('clean-html');
const fs          = require('fs');
const path        = require('path');
const PATH        = require('./path');

class Watcher {
	static compilePug(filePath){
		let fn = pug.compileFile(filePath)
		return fn();
	}
	compileSass(filePath){
		let fn = sass.renderSync({file: filePath}).css;
		return fn;
	}
	htmlBeautify(file){
		var data = Watcher.compilePug(file),
				out;
		cleanHTML.clean(data, function(html){
			out = html;
		});

		return out;
	}
	watchBlocks(){
		browserSync.watch(path.join(PATH.BLOCKS, '*/*.*'), (event, file)=>{
			if (path.extname(file) == '.sass') {
				fs.writeFile(file.replace('.sass', '.css'), this.compileSass(file), (err) => {
				
				});
			} else if (path.extname(file) == '.pug') {
				fs.writeFile(file.replace('.pug', '.html'), Watcher.compilePug(file), (err) => {
				
				});
			}

			if (event == 'change' && path.extname(file) == '.sass') {
				browserSync.reload(file.replace('.sass', '.css'));
			} 
			// else if (event == 'change' && path.extname(file) == '.pug') {
			// 	browserSync.reload(path.join(PATH.DEV + '*.html'));
			// }
		});
	}
	watchComponents(){
		browserSync.watch(path.join(PATH.COMPS, '*/*.*'), (event, file)=>{
			if (path.extname(file) == '.sass') {
				fs.writeFile(file.replace('.sass', '.css'), this.compileSass(file), (err) => {
				
				});
			} 

			// else if (path.extname(file) == '.pug') {
			// 	fs.writeFile(file.replace('.pug', '.html'), Watcher.compilePug(file), (err) => {
				
			// 	});
			// }
			
			if (event == 'change' && path.extname(file) == '.sass') {
				browserSync.reload(file.replace('.sass', '.css'));
			} else if (event == 'change' && path.extname(file) == '.pug') {
				browserSync.reload(path.join(PATH.DEV + '*.html'));
			}
		});
	}
	watchPages(){
		browserSync.watch(path.join(PATH.PAGES, '*/*.pug'), (event, file)=>{
			fs.writeFile(path.join(PATH.DEV, path.basename(file.replace('.pug', '.html'))), Watcher.compilePug(file), (err) => {
				
			});

			
			browserSync.reload(path.join(PATH.DEV + '*.html'));
		});
	}
	watchSysSass(){
		browserSync.watch(path.join(PATH.SASS, '**/*.sass'), (event, file)=>{
			var cssFile = path.join(PATH.CSS, path.basename(file.replace('.sass', '.css')));
			fs.writeFile(cssFile, this.compileSass(file), (err) => {
			
			});
			
			browserSync.reload(cssFile.replace('.sass', '.css'));
		});
	}
	static compilePages(){
		var getFiles = function (dir, files_){
		
			files_ = files_ || [];
				var files = fs.readdirSync(dir);
				for (var i in files){
					var name = dir + '/' + files[i];
					if (files[i] != '_.pug') {
						if (fs.statSync(name).isDirectory()){
								getFiles(name, files_);
						} else {
							files_.push(name);
						}
					}
				}
			return files_;
		};


		getFiles(PATH.PAGES).forEach((file)=>{
			fs.writeFile(path.join(PATH.DEV, path.basename(file.replace('.pug', '.html'))), Watcher.compilePug(file), (err) => {
				
			});	
		})
		
	}
	constructor(){
		browserSync.init({
			server: PATH.DEV
		});
		this.watchPages();
		this.watchComponents();
		this.watchBlocks();
		this.watchSysSass()
	}
}

module.exports = Watcher;