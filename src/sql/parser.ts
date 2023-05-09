import { SyntaxError } from '../util/errors';
import * as AST from './models/ast';
import { SQLToken } from './models/token';

export class Parser {
  private index = 0;
  private rawTokens: SQLToken[];

  constructor(tokens: SQLToken[]) {
    this.rawTokens = tokens;
  }

  public getAST(): AST.AST {
    if (this.rawTokens[0].value !== 'SELECT') {
      throw new Error('Not yet implemented');
    }

    // Skip SELECT
    this.incrementCursor();

    return new AST.SelectStatement(
      this.parseSelectDisplayValue(),
      this.parseSelectTableSource()
    );
  }

  private parseSelectDisplayValue(): AST.DisplayValue[] {
    const displayValues: AST.DisplayValue[] = [];
    const tokens = this.gatherUntilValue('FROM');

    let i = 0;
    while (i < tokens.length) {

      // Simple table selections
      if (tokens[i].type === 'IDENTIFIER') {
        displayValues.push(new AST.DisplaySelector(tokens[i].value));
        i++;
        continue;
      }

      // Function selections
      // TODO

      // Constant values
      // TODO

      // Throw Error
      // TODO
      i++;
    }
    return displayValues;
  }

  private parseSelectTableSource(): AST.TableSource {
    if (!this.hasNextToken()) {
      throw new SyntaxError(`Expected FROM at position ${this.rawTokens[this.index - 1].position}`);

    }

    if (this.peek().value !== 'FROM') {
      throw new SyntaxError(`Expected FROM at position ${this.peek().position}`);
    }

    // Skip FROM
    this.incrementCursor();

    return new AST.TableSource(this.gatherUntilValue('GROUP')[0].value);
  }

  private gatherUntilValue(...endTokenValues: string[]): SQLToken[] {
    const tokens: SQLToken[] = [];
    while (this.hasNextToken() && endTokenValues.indexOf(this.peek().value) < 0) {
      tokens.push(this.getToken());
    }
    return tokens;
  }

  private hasNextToken(): boolean {
    return this.index < this.rawTokens.length;
  }

  private peek(): SQLToken {
    return this.rawTokens[this.index];
  }

  private getToken(): SQLToken {
    return this.rawTokens[this.index++];
  }

  private incrementCursor(): void {
    this.index++;
  }
}
