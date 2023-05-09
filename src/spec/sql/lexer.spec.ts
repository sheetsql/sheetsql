import { expect } from 'chai';
import { Lexer } from '../../sql/lexer';
import { SQLToken } from '../../sql/models/token';

import 'mocha';
import 'ts-node';

describe('Lexer', () => {
  describe('#getAllTokens', () => {
    it('should return an array of tokens', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const result = lexer.getAllTokens();
      expect(result).to.be.an('array');
      result.forEach((x) => {
        expect(x).to.have.property('type');
        expect(x).to.have.property('value');
        expect(x).to.have.property('position');
      });
    });

    it('should return an empty array when instantiated with an empty string', () => {
      const lexer = new Lexer('');
      const result = lexer.getAllTokens();
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should ignore leading whitespace', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const result = lexer.getAllTokens();

      const lexerSpace = new Lexer(' SELECT * FROM test;');
      const resultSpace = lexerSpace.getAllTokens();
      expect(result.length).to.equal(resultSpace.length);

      const lexerMultiSpace = new Lexer('      SELECT * FROM test;');
      const resultMultiSpace = lexerMultiSpace.getAllTokens();
      expect(result.length).to.equal(resultMultiSpace.length);

      const lexerTab = new Lexer('\tSELECT * FROM test;');
      const resultTab = lexerTab.getAllTokens();
      expect(result.length).to.equal(resultTab.length);
    });

    it('should ignore trailing whitespace', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const result = lexer.getAllTokens();

      const lexerSpace = new Lexer('SELECT * FROM test; ');
      const resultSpace = lexerSpace.getAllTokens();
      expect(result.length).to.equal(resultSpace.length);

      const lexerMultiSpace = new Lexer('SELECT * FROM test;    ');
      const resultMultiSpace = lexerMultiSpace.getAllTokens();
      expect(result.length).to.equal(resultMultiSpace.length);

      const lexerTab = new Lexer('SELECT * FROM test;\t');
      const resultTab = lexerTab.getAllTokens();
      expect(result.length).to.equal(resultTab.length);
    });

    it('should ignore middle whitespace', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const result = lexer.getAllTokens();

      const lexerSpace = new Lexer('SELECT *        FROM test;');
      const resultSpace = lexerSpace.getAllTokens();
      expect(result.length).to.equal(resultSpace.length);

      const lexerTab = new Lexer('SELECT * \t\tFROM test;');
      const resultTab = lexerTab.getAllTokens();
      expect(result.length).to.equal(resultTab.length);
    });

    it('should ignore newlines', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const result = lexer.getAllTokens();

      const lexerNewline = new Lexer(`SELECT *
        FROM test;`);
      const resultNewline = lexerNewline.getAllTokens();
      expect(result.length).to.equal(resultNewline.length);

      const lexerMultiNewline = new Lexer('SELECT *\nFROM test\n;');
      const resultMultiNewline = lexerMultiNewline.getAllTokens();
      expect(result.length).to.equal(resultMultiNewline.length);
    });
  });

  describe('functional examples', () => {
    const compareTokens = (lexer: Lexer, expectedResponse: SQLToken[]) => {
      const resp = lexer.getAllTokens();
      expect(resp.map(x => x.type)).to.eql(expectedResponse.map(x => x.type));
      expect(resp.map(x => x.value)).to.eql(expectedResponse.map(x => x.value));
      expect(resp.map(x => x.position)).to.eql(expectedResponse.map(x => x.position));
    }

    it('SELECT * FROM test', () => {
      const lexer = new Lexer('SELECT * FROM test');
      const expectedResponse = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', '*', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'test', 14)
      ];

      compareTokens(lexer, expectedResponse);
    });

    it('SELECT * FROM test;', () => {
      const lexer = new Lexer('SELECT * FROM test;');
      const expectedResponse = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', '*', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'test', 14)
      ];

      compareTokens(lexer, expectedResponse);
    });

    it('SELECT * from TEST;', () => {
      const lexer = new Lexer('SELECT * from TEST;');
      const expectedResponse = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('IDENTIFIER', '*', 7),
        new SQLToken('KEYWORD', 'FROM', 9),
        new SQLToken('IDENTIFIER', 'test', 14)
      ];

      compareTokens(lexer, expectedResponse);
    });

    it('SELECT COUNT(*) FROM test AS T GROUP BY T.id;', () => {
      const lexer = new Lexer('SELECT COUNT(*) FROM test AS T GROUP BY T.id;');
      const expectedResponse = [
        new SQLToken('KEYWORD', 'SELECT', 0),
        new SQLToken('FUNCTION', 'COUNT', 7),
        new SQLToken('PUNCTUATION', '(', 12),
        new SQLToken('IDENTIFIER', '*', 13),
        new SQLToken('PUNCTUATION', ')', 14),
        new SQLToken('KEYWORD', 'FROM', 16),
        new SQLToken('IDENTIFIER', 'test', 21),
        new SQLToken('KEYWORD', 'AS', 26),
        new SQLToken('IDENTIFIER', 't', 29),
        new SQLToken('KEYWORD', 'GROUP', 31),
        new SQLToken('KEYWORD', 'BY', 37),
        new SQLToken('IDENTIFIER', 't.id', 40)
      ];

      compareTokens(lexer, expectedResponse);
    });
  });
});
