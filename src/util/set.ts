/*
* Set implementation based loosly on JS sets, as per this MDN page:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
*
* Does not implement Set.prototype[@@iterator]()
*/

export class Set {
  private store: any = {};
  private orderedStore: any[] = [];

  // This _should_ accept any iterable, but is restricted to arrays
  // because we're building to es5
  constructor(init?: any[] | null) {
    if (init) {
      init.forEach((x) => { this.add(x); });
    }
  }

  get size(): number {
    return Object.keys(this.store).length;
  }

  public add(value: any): Set {
    if (this.store[value] === undefined) {
      this.store[value] = true;
      this.orderedStore.push(value);
    }

    return this;
  }

  public clear(): void {
    this.store = {};
    this.orderedStore = [];
  }

  public delete(value: any): boolean {
    const had = this.has(value);
    if (had) {
      delete this.store[value];
      this.orderedStore.splice(this.orderedStore.indexOf(value), 1);
    }
    return had;
  }

  public entries(): any[] {
    return this.orderedStore.map((k) => [k, k]);
  }

  public forEach(callbackfn: (value: any, index: number, array: string[]) => void, thisArg?: any): void {
    this.orderedStore.forEach(callbackfn, thisArg);
  }

  public has(value: any): boolean {
    return !!this.store[value];
  }

  public keys(): any[] {
    return this.values();
  }

  public values(): any[] {
    return this.orderedStore;
  }
}
