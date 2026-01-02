export class OrderedArray<T extends Record<string, unknown>, K> {
  private _data: [K, T][];
  private _comparor: (a: K, b: K) => number;

  constructor(comparor: (a: K, b: K) => number) {
    this._data = [];
    this._comparor = comparor;
  }

  insert(key: K, data: T): void {
    let lowerBound = 0;
    let upperBound = this._data.length;

    while (lowerBound < upperBound) {
      const mid = lowerBound + Math.floor((upperBound - lowerBound) / 2);
      const [k] = this._data[mid];
      const cmp = this._comparor(key, k);
      if (cmp < 0) {
        upperBound = mid;
      } else if (cmp > 0) {
        lowerBound = mid + 1;
      } else {
        lowerBound = mid;
        break;
      }
    }

    this._data.splice(lowerBound, 0, [key, data]);
  }

  remove(key: K, data?: Partial<T>): void {
    const index = this.order(key, data);
    if (index >= 0) {
      this._data.splice(index, 1);
    }
  }

  removeByData(data: Partial<T>): void {
    const indexes: number[] = [];
    for (const [i, [, d]] of this._data.entries()) {
      let match = true;
      for (const [key, value] of Object.entries(data)) {
        if (d[key] !== value) {
          match = false;
          break;
        }
      }
      if (match) {
        indexes.push(i);
      }
    }
    for (const i of indexes) {
      this._data.splice(i, 1);
    }
  }

  order(key: K, data?: Partial<T>): number {
    return this._data.findIndex(([k, v]) => {
      if (this._comparor(k, key) !== 0) {
        return false;
      }
      if (!data) {
        return true;
      }
      for (const [key, value] of Object.entries(data)) {
        if (v[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  orderByData(data: Partial<T>): number {
    return this._data.findIndex(([, v]) => {
      for (const [key, value] of Object.entries(data)) {
        if (v[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  clear(): void {
    this._data = [];
  }

  contains(key: K, data?: Partial<T>): boolean {
    return this.order(key, data) >= 0;
  }

  get keys(): K[] {
    return this._data.map(([k]) => k);
  }

  get data(): T[] {
    return this._data.map(([, d]) => d);
  }

  get length(): number {
    return this._data.length;
  }

  get(index: number): T | undefined {
    return this._data[index]?.[1];
  }

  find(predicate: (item: T, index: number) => boolean): T | undefined {
    return this._data.find(([, d], i) => predicate(d, i))?.[1];
  }

  filter(predicate: (item: T, index: number) => boolean): T[] {
    return this._data.filter(([, d], i) => predicate(d, i)).map(([, d]) => d);
  }

  map<U>(mapper: (item: T, index: number) => U): U[] {
    return this._data.map(([, d], i) => mapper(d, i));
  }

  forEach(callback: (item: T, index: number) => void): void {
    this._data.forEach(([, d], i) => callback(d, i));
  }

  reduce<U>(
    reducer: (acc: U, item: T, index: number) => U,
    initialValue: U
  ): U {
    return this._data.reduce(
      (acc, [, d], i) => reducer(acc, d, i),
      initialValue
    );
  }
}

export { OrderedArray as default };
