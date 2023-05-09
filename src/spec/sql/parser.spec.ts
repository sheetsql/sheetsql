import { expect } from 'chai';

import * as AST from '../../sql/models/ast';
import { Parser } from '../../sql/parser';
import { SQLToken } from '../../sql/models/token';

import 'mocha';
import 'ts-node';

describe('Parser', () => {
  const compareASTs = (parser: Parser, expectedResponse: AST.AST) => {
    const response = parser.getAST();
    expect(response).to.eql(expectedResponse);
  }

  describe('handles SELECT statements', () => {
    it('creates nodes for simple column selectors and table selectors', () => {
      const tokens = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', 'column_name', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'table_name', 14)
      ];

      const expected = new AST.SelectStatement(
        [new AST.DisplaySelector('column_name')],
        new AST.TableSource('table_name')
      );

      compareASTs(new Parser(tokens), expected);
    });

    it('creates nodes for chained column selectors', () => {
      const tokens = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', 'table_name.column_name', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'table_name', 14)
      ];

      const expected = new AST.SelectStatement(
        [new AST.DisplaySelector('table_name.column_name')],
        new AST.TableSource('table_name')
      );

      compareASTs(new Parser(tokens), expected);
    });

    it('creates nodes for star column selectors', () => {
      const tokens = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', '*', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'table_name', 14)
      ];

      const expected = new AST.SelectStatement(
        [new AST.DisplaySelector('*')],
        new AST.TableSource('table_name')
      );

      compareASTs(new Parser(tokens), expected);
    });
  });

  describe('thows errors on invalid input', () => {
    const testThrow = (parser: Parser, expectedThrow: string) => {
      const executor = () => { parser.getAST(); }
      expect(executor).to.throw(expectedThrow);
    }

    it('does not handle non-SELECT statements', () => {
      const tokens = [
        new SQLToken('KEYWORD', 'CREATE', 0),
        new SQLToken('KEYWORD', 'TABLE', 7),
        new SQLToken('IDENTIFIER', 'table_name', 12)
      ];

      testThrow(new Parser(tokens), 'Not yet implemented');
    });

    it('does not handle non-SELECT statements', () => {
      const tokens = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', '*', 7),
        new SQLToken('KEYWORD', 'BY', 9)
      ];

      testThrow(new Parser(tokens), 'Expected FROM at position 9');
    });
  });
});
