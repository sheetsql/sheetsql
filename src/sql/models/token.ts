import { Set } from '../../util/set';

export type SQLTokenType = 'FUNCTION' |
                           'IDENTIFIER' |
                           'KEYWORD' |
                           'NUMBER' |
                           'OPERATOR' |
                           'PUNCTUATION' |
                           'STRING';

export class SQLToken {
  constructor(
    public type: SQLTokenType,
    public value: string,
    public position: number
  ) { };
}

export const SQL_FUNCTIONS = new Set([
  'AVG',
  'COUNT',
  'MAX',
  'MIN',
  'ROUND',
  'SUM'
]);

export const SQL_KEYWORDS = new Set([
  'ALTER',
  'AS',
  'BY',
  'CREATE',
  'DELETE',
  'DISTINCT',
  'FROM',
  'GROUP',
  'INNER',
  'INSERT',
  'JOIN',
  'LEFT',
  'LIMIT',
  'ORDER',
  'OUTER',
  'RIGHT',
  'SELECT',
  'TABLE',
  'UPDATE',
  'WHERE'
]);

export const SQL_OPERATORS = new Set([
  '!=',
  '<',
  '<=',
  '<>',
  '=',
  '>',
  '>=',
  'AND',
  'BETWEEN',
  'LIKE',
  'OR'
]);

export const SQL_PUNCTUATION = new Set([
  '(', 
  ')', 
  ';', 
  ','
]);
