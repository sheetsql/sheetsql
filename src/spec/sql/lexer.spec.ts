import { expect } from 'chai';
import { Lexer } from '../../sql/lexer';

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

    // it('DEVELOP', () => {
    //   const lexer = new Lexer('SELECT COUNT(*) FROM test AS T GROUP BY T.id;');
    //   console.log(lexer.getAllTokens());
    // });

  });

});
