export type AST = SelectStatement;

export class SelectStatement {
  constructor(
    public displayValues: DisplayValue[],
    public dataSource: TableSource,
    public condition?: DataConditional
  ) {}
};

export type DisplayValue = DisplaySelector | DisplayFunction;

export class DisplaySelector {
  public fullyQualifiedSelector: {
    schema: string;
    table: string;
    column: string;
  } = {
    schema: '',
    table: '',
    column: ''
  };

  constructor(
    public selector: string
  ) {}
};

export class DisplayFunction {
  constructor(
    public functionName: string,
    public args: FunctionArgument[]
  ) {}
};

type FunctionArgument = number | string | DisplaySelector | DisplayFunction;

export class TableSource {
  public fullyQualifiedSelector: {
    schema: string;
    table: string;
  } = {
    schema: '',
    table: ''
  };

  constructor(
    public selector: string,
    public joinWith?: {
      joinTable: TableSource,
      joinType: JoinTypes,
      joinCondition: DataConditional
    }
  ) {}
};

type JoinTypes = 'INNER' | 'OUTER' | 'LEFT' | 'RIGHT';

export class DataConditional {
  constructor(
    public operator: ConditionalOperatorTypes,
    public leftVal: DisplaySelector,
    public rightVal: DisplaySelector
  ) {}
};

type ConditionalOperatorTypes = '!=' | '<' | '<=' | '<>' | '=' | '>' | '>=';
