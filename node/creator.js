const fs   = require('fs');
const path = require('path');
class Creator {
	constructor(name, folder, exts, message){
		var dir = path.join(folder, name)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			for (let ext of exts) {
				fs.readFile(path.join(folder, '_' + ext), (err, data)=>{
					var text = data.toString().replace(/iName/g, name);
					fs.writeFile(path.join(dir, name + ext), text, (err)=>{
					});
				});
			}
			console.log(message.true);
		} else{
			console.log(message.false);
		}
	}
}
module.exports = Creator;