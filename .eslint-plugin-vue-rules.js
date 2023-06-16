/**
 * plugin:vue/vue3-recommended
 * https://eslint.vuejs.org/rules/
 */

module.exports = {
  /* Priority A: Essential */
  'vue/multi-word-component-names': ['off'],

  // 多分大丈夫
  'vue/no-setup-props-destructure': ['off'],

  /* Priority B: Strongly Recommended */

  /**
   * コンポーネントのプロパティ名を、kebab-caseに強制するかどうか
   * always(default) | never
   */
  'vue/attribute-hyphenation': ['error', 'always', {
    'ignore': ['my-prop'],
  }],

  /**
   * コンポーネント定義名を、(PascalCase or kebab-case)に統一する
   * PascalCase(default) | kebab-case
   */
  'vue/component-definition-name-casing': ['error', 'PascalCase'],


  'vue/no-parsing-error': ['off'],

  /**
   * タグの閉じ括弧(>)の前に改行を要求または禁止する
   * singleline: never(default) | always
   * multiline : never | always(default)
   */
  'vue/html-closing-bracket-newline': ['error', {
    'singleline': 'never',
    'multiline' : 'always',
  }],

  /**
   * タグの閉じ括弧(>)の前にスペースを要求または禁止する
   * startTag       : always | never(default)
   * endTag         : always | never(default)
   * selfClosingTag : always(default) | never
   */
  'vue/html-closing-bracket-spacing': ['error', {
    'startTag'      : 'never',
    'endTag'        : 'never',
    'selfClosingTag': 'always',
  }],

  /**
   * 終了タグを強制する('vue/html-self-closing'と競合するのでオススメしない)
   */
  'vue/html-end-tags': ['off'],

  /**
   * <template>内でのインデントの設定
   * type (number | "tab") 数値を指定で半角スペースを使用する(デフォルトは2)
   * attribute (integer)
   * baseIndent (integer)
   * closeBracket (integer | object)
   * alignAttributesVertically (boolean)
   * ignores (string[])
   */
  'vue/html-indent': ['error', 2, {
    'attribute'                : 1,
    'baseIndent'               : 1,
    'closeBracket'             : 0,
    'alignAttributesVertically': true,
    'ignores'                  : [],
  }],

  /**
   * 属性指定時のクオートを(single or double)にする
   * "double"(default) | "single"
   */
  'vue/html-quotes': ['error', 'double', { 'avoidEscape': false }],

  /**
   * 中身を持たない要素の終了タグを省略するどうか(e.g. <br />)
   */
  'vue/html-self-closing': ['error', {
    'html': {
      'void'     : 'never',
      'normal'   : 'always',
      'component': 'always',
    },
    'svg' : 'always',
    'math': 'always',
  }],

  'vue/v-on-event-hyphenation': 'off',

  /**
   * 一行あたりに指定できるプロパティの数
   */
  'vue/max-attributes-per-line': ['error', {
    'singleline': {
      'max': 2,
      // 'allowFirstLine': true,
    },
    'multiline' : {
      'max': 1,
      // 'allowFirstLine': false,
    },
  }],

  /**
   * 複数行要素の内容の前後に改行を必要とする
   */
  'vue/multiline-html-element-content-newline': ['error', {
    'ignoreWhenEmpty': true,
    'allowEmptyLines': false,
    'ignores': ['pre', 'textarea'],
  }],

  /**
   * {{}} 構文の内側の両端にスペースを必要とする
   * always(default) | never
   */
  'vue/mustache-interpolation-spacing': ['error', 'always'],

  /**
   * インデントに使用されないタグ内の複数のスペースを削除する
   */
  'vue/no-multi-spaces': ['error', {
    'ignoreProperties': false,
  }],

  /**
   * プロパティの等号(=)の左右のスペースを禁止する
   */
  'vue/no-spaces-around-equal-signs-in-attribute': ['error'],

  /**
   * v-forディレクティブにおいて、外側のスコープで宣言された変数名の再定義を禁止する
   */
  'vue/no-template-shadow': ['error'],

  /**
   * ファイルごとにコンポーネントが1つしかないかどうかをチェックする
   */
  'vue/one-component-per-file': ['error'],

  /**
   * コンポーネントのpropsにおける定義名を(camelCase or snake_case)に強制する
   * "camelCase"(default) | "snake_case"
   */
  'vue/prop-name-casing': ['error', 'camelCase'],

  /**
   * コンポーネントのpropsにおいて、requiredがtrueではない場合のdefault値を必須とする
   */
  'vue/require-default-prop': ['error'],

  /**
   * emitsで指定されていないイベントのemitを禁止する
   */
  'vue/require-explicit-emits': ['error', {
    'allowProps': false,
  }],

  /**
   * コンポーネントのpropsのタイプ指定を必須とする
   */
  'vue/require-prop-types': ['error'],

  /**
   * 単一行要素の内容の前後に改行を必要とする
   */
  'vue/singleline-html-element-content-newline': ['error', {
    'ignoreWhenNoAttributes': true,
    'ignoreWhenEmpty'       : true,
    'ignores'               : ['pre', 'textarea', 'span', 'div'],
  }],

  /**
   * v-bind構文を省略記法にするかどうか
   * "shorthand" | "longform"
   */
  'vue/v-bind-style': ['error', 'shorthand'],

  /**
   * v-on構文を省略記法にするかどうか
   * "shorthand" | "longform"
   */
  'vue/v-on-style': ['error', 'shorthand'],

  /**
   * v-slot構文を省略記法にするかどうか
   * atComponent: "shorthand" | "longform" | "v-slot"(default)
   * default    : "shorthand"(default) | "longform" | "v-slot"
   * named      : "shorthand"(default) | "longform"
   */
  'vue/v-slot-style': ['error', {
    'atComponent': 'shorthand',
    'default'    : 'shorthand',
    'named'      : 'shorthand',
  }],
}