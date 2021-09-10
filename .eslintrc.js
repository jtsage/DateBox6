module.exports = {
	'parser' : '@babel/eslint-parser',
	'env' : {
		'browser'  : true,
		'commonjs' : true,
		'es2021'   : true,
		'node'     : true,
		'mocha'    : true,
	},
	'extends' : 'eslint:recommended',
	'parserOptions' : {
		'ecmaVersion'       : 12,
		'requireConfigFile' : false,
	},
	'rules' : {
		'indent' : [
			'error',
			'tab',
			{
				'SwitchCase' : 1,
			},
		],
		'quotes' : [
			'error',
			'single',
		],
		'semi' : [
			'error',
			'always',
		],
		'no-unused-vars' : [
			'error',
			{
				'vars' : 'local',
				'varsIgnorePattern' : '^_|DateBoxDate',
			},
		],
		'max-len' : [
			'error',
			{ 'code' : 100 }
		],
		'no-trailing-spaces' : [
			'error',
			{
				'skipBlankLines' : true,
				'ignoreComments' : true,
			},
		],
		'dot-notation' : [
			'error',
		],
		'comma-dangle' : [
			'error',
			{
				'arrays'    : 'only-multiline',
				'objects'   : 'always-multiline',
				'imports'   : 'never',
				'exports'   : 'never',
				'functions' : 'never',
			}
		],
		'key-spacing' : [
			'error',
			{
				'beforeColon' : true,
				'afterColon'  : true,
				'mode'        : 'minimum',
			},
		],
		'array-bracket-spacing' : [
			'error',
			'never'
		],
		'no-await-in-loop'           : 'error',
		'no-promise-executor-return' : 'error',
		'no-useless-backreference'   : 'error',
		'require-atomic-updates'     : 'error',
		'default-case'               : 'error',
		'eqeqeq'                     : 'error',
		'no-else-return'             : 'error',
		'no-global-assign'           : 'error',
		'no-implicit-globals'        : 'error',
		'no-multi-str'               : 'error',
		'no-param-reassign'          : 'error',
		'no-return-await'            : 'error',
		'no-sequences'               : 'error',
		'no-unused-expressions'      : 'error',
		'comma-spacing'              : 'error',
		'func-call-spacing'          : 'error',
		'keyword-spacing'            : 'error',
		'no-lonely-if'               : 'error',
		'no-unneeded-ternary'        : 'error',
		'arrow-parens'               : 'error',
		'no-var'                     : 'error',
		'prefer-const'               : 'error',
		'prefer-arrow-callback'      : 'error',
		'prefer-template'            : 'error',
		'no-useless-concat'          : 'error',
		'no-multi-assign'            : 'error',
	},
};
