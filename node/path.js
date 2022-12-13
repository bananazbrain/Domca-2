class PATH {
	static SRC     = './source/';
	static DEV     = this.SRC + 'dev/';
	static DIST    = this.SRC + 'dist/';
	static ASSETS  = this.DEV + '_/';
	static UPLOAD  = this.ASSETS + 'upload/';
	static BLOCKS  = this.ASSETS + 'blocks/';
	static COMPS   = this.ASSETS + 'components/';
	static TEMPS   = this.ASSETS + 'templates/';
	static PAGES   = this.ASSETS + 'pages/';
	static SYS     = this.ASSETS + 'sys/';
	static CSS     = this.SYS + 'css/';
	static SASS    = this.SYS + 'sass/';
	static PUG     = this.SYS + 'pug/';
	static JS      = this.SYS + 'js/';
	static IMGS    = this.SYS + 'imgs/';
	static LIBS    = this.SYS + 'libs/';
	static FONTS   = this.SYS + 'fonts/';
}

module.exports = PATH;