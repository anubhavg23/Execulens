import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export function parseCode(code, language) {
  try {
    if (language === 'javascript') {
      return esprima.parseScript(code, { range: true, loc: true });
    } else {
      return parse(code, {
        sourceType: 'module',
        plugins: ['python'],
        ranges: true,
        loc: true
      });
    }
  } catch (error) {
    throw error;
  }
}