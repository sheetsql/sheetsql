import {
  SQL_FUNCTIONS,
  SQL_KEYWORDS,
  SQL_OPERATORS,
  SQL_PUNCTUATION,
  SQLToken
} from './models/token';

export class Lexer {
  private static NUMBER_REGEX: RegExp = /^[+\-]?\d*\.\d*$/;
  private static WHITESPACE_REGEX: RegExp = /\n|\s|\t|\r/;

  private index = 0;
  private rawText: string;

  constructor(input: string) {
    this.rawText = input.replace(/\W+$/, '');
  }

  //
  // Public API
  //

  public getAllTokens(): SQLToken[] {
    const tokens = [];

    while (this.hasNextToken()) {
      tokens.push(this.getNextToken());
    }

    return tokens;
  }

  public getNextToken(): SQLToken {
    this.skipWhitespace();

    const initalIndex = this.index;

    // Single quotes wrap strings
    if (this.peek() === "'") {
      this.incrementCursor();
      const singleQuoted = this.gatherUntil("'");
      this.incrementCursor();
      return new SQLToken('STRING', singleQuoted, initalIndex);
    }

    // Double quotes wrap literal identifiers
    if (this.peek() === '"') {
      const doubleQuoted = this.getChar() + this.gatherUntil('"') + this.getChar();
      return new SQLToken('IDENTIFIER', doubleQuoted, initalIndex);
    }

    // Punctuation
    if (SQL_PUNCTUATION.has(this.peek())) {
      return new SQLToken('PUNCTUATION', this.getChar(), initalIndex);
    }

    // Muli-char tokens

    let val = this.getChar();
    while (this.hasNextChar() && !this.peek().match(Lexer.WHITESPACE_REGEX)) {
      val += this.getChar();
    }

    if (val.match(Lexer.NUMBER_REGEX)) {
      return new SQLToken('NUMBER', val, initalIndex);
    }

    if (SQL_OPERATORS.has(val)) {
      return new SQLToken('OPERATOR', val, initalIndex);
    }

    if (SQL_KEYWORDS.has(val)) {
      return new SQLToken('KEYWORD', val, initalIndex);
    }

    if (SQL_FUNCTIONS.has(val)) {
      return new SQLToken('FUNCTION', val, initalIndex);
    }

    return new SQLToken('IDENTIFIER', val, initalIndex);
  }

  public hasNextToken(): boolean {
    return this.index < this.rawText.length;
  }

  //
  // Token Utilities
  //

  private skipWhitespace(): void {
    while (this.peek().match(Lexer.WHITESPACE_REGEX)) {
      this.incrementCursor();
    }
  }

  private gatherUntil(endChar: string): string {
    let val = '';
    while (this.hasNextChar() && this.peek() !== endChar) {
      val += this.getChar();
    }

    return val;
  }

  //
  // Character Utilities
  //

  private hasNextChar(): boolean {
    return this.index < this.rawText.length;
  }

  private peek(): string {
    return this.rawText[this.index] || '';
  }

  private getChar(): string {
    return this.rawText[this.index++] || '';
  }

  private incrementCursor(): void {
    this.index++;
  }
}
