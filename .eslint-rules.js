/**
 * eslint:recommended
 * https://eslint.org/docs/rules/
 */

module.exports = {
  /* Best Practices */

  // 等式演算子===および!==を使用する
  'eqeqeq': ['error', 'always'],

  /* Stylistic Issues */

  // 配列の先頭と末尾を改行するかは自由。ただし同一配列内では統一する。
  'array-bracket-newline': ['error', 'consistent'],

  // 配列の先頭と末尾にはスペースをあけない。
  'array-bracket-spacing': ['error', 'never'],

  // 配列の中の要素を改行するかは自由。ただし同一配列内では統一する。
  'array-element-newline': ['error', 'consistent'],

  // ブロック(={})の先頭と末尾にはスペースをあける
  'block-spacing': 'error',

  // オブジェクト(={})の先頭と末尾にはスペースをあける
  'object-curly-spacing': ['error', 'always'],

  // 変数名は全てcamelCase
  'camelcase': 'error',

  // プロパティが複数行にまたがる場合、基本的には最終行にもカンマをつける
  'comma-dangle': ['error', {
    'arrays'   : 'always-multiline',
    'objects'  : 'always-multiline',
    'imports'  : 'always-multiline',
    'exports'  : 'always-multiline',
    'functions': 'only-multiline',
  }],

  // カンマの前にはスペースをあけず、カンマの後にはスペースをあける。
  'comma-spacing': ['error', {
    'before': false,
    'after' : true,
  }],

  // 空ではないファイルの最終行は空白にする。
  'eol-last': ['error', 'always'],

  // インデントは常にスペース2つ。
  'indent': ['error', 2],

  // オブジェクトのコロンの前後にスペースをあけるかどうか。
  // 'key-spacing': ['warn', {
  //   'multiLine': {            // 複数行のvalueの場合
  //     'beforeColon': false,   // コロンの前はスペースなし
  //     'afterColon' : true,    // コロンの後はスペースあり
  //   },
  //   'align': {                // 一行のvalueが、複数行続く場合
  //     'beforeColon': false,   // コロンの前はスペースなし(例外あり)
  //     'afterColon' : true,    // コロンの後はスペースあり
  //     // 'on'         : 'colon', // コロンを最長の位置に合わせる
  //   },
  // }],

  // ifやtryステートメントの前後にスペースが必要かどうか
  'keyword-spacing': ['error', {
    'before': true,
    'after' : true,
  }],

  // 三項演算子の改行を統一する
  'multiline-ternary': ['error', 'always-multiline'],

  // スペースとタブを混同させない
  'no-mixed-spaces-and-tabs': 'error',

  // 連続する空白行は許容しない
  'no-multiple-empty-lines': ['error', {
    'max'   : 1,
    'maxEOF': 0,
  }],

  // 無駄なスペースを取り除く
  'no-trailing-spaces': 'error',

  // ◯シングルクオートｘダブルクオート
  'quotes': ['error', 'single'],

  // セミコロンは基本的に使用しない
  'semi': ['warn', 'never'],

  // セミコロンを省略することで不具合が生じる場合は警告する
  'no-unexpected-multiline': ['error'],

  // 未定義オブジェクトの参照を許可する
  'no-undef': 'off',
}