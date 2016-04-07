var superTinyCompiler = require('./super-tiny-compiler-nik-mod');
var assert            = require('assert');

var tokenizer     = superTinyCompiler.tokenizer;
var parser        = superTinyCompiler.parser;
var transformer   = superTinyCompiler.transformer;
var codeGenerator = superTinyCompiler.codeGenerator;
var compiler      = superTinyCompiler.compiler;

var input  = '(add 2 (subtract 4 2))';
var output = 'add(2, subtract(4, 2));';

var input1 = '(/ (* 10 2) (- 5 2))';
var output1 = '((10 * 2) / (5 - 2))';

var tokens = [
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        }
];

var tokens1 = [ 
  { type: 'paren',  value: '('        },
  { type: 'oper',   value: '/'        },
  { type: 'paren',  value: '('        },
  { type: 'oper',   value: '*'        },
  { type: 'number', value: '10'       },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: '('        },
  { type: 'oper',   value: '-'        },
  { type: 'number', value: '5'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        } 
];


var ast = {
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
};

var ast1 = {
  type: "Program",
  body: [
    {
      "type": "Expression",
      "operator": "/",
      "params": [
        {
          "type": "Expression",
          "operator": "*",
          "params": [
            {
              "type": "NumberLiteral",
              "value": "10"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        },
        {
          "type": "Expression",
          "operator": "-",
          "params": [
            {
              "type": "NumberLiteral",
              "value": "5"
            },
            {
              "type": "NumberLiteral",
              "value": "2"
            }
          ]
        }
      ]
    }
  ]
};

var newAst = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
};

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
var compilerOutput = compiler(input);
console.log("Compiler output: " + compilerOutput);
assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');


// var compilerOutput2 = compiler(input2);
// console.log("Compiler output: " + compilerOutput2);
// assert.deepEqual(compilerOutput2, output2, 'Compiler should turn `input` into `output`');

console.log('All Passed!');
