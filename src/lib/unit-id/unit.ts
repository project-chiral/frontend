import type { UnitType } from 'dayjs';

export const UNITS = [
  'century',
  'decade',
  'year',
  'month',
  'date',
  'hour',
  'minute',
  'second',
] as const;
export type UnitType = (typeof UNITS)[number];

export class Unit {
  private readonly _order: number;

  constructor(order: number | UnitType) {
    if (typeof order === 'number') {
      this._order = order;
    } else {
      this._order = UNITS.indexOf(order);
    }
    if (this._order < 0 || this._order >= UNITS.length) {
      throw new Error(`Invalid unit order: ${order}`);
    }
  }

  get order(): number {
    return this._order;
  }

  get type(): UnitType {
    return UNITS[this._order];
  }

  toString(): string {
    return this.type;
  }

  static fromUnit(type: UnitType): Unit {
    return new Unit(type);
  }

  static fromOrder(order: number): Unit {
    return new Unit(order);
  }

  upper(): Unit | null {
    return this._order < UNITS.length - 1 ? new Unit(this._order + 1) : null;
  }

  lower(): Unit | null {
    return this._order > 0 ? new Unit(this._order - 1) : null;
  }

  isSame(other: Unit): boolean {
    return this._order === other._order;
  }

  isHigher(other: Unit): boolean {
    return this._order > other._order;
  }

  isLower(other: Unit): boolean {
    return this._order < other._order;
  }

  serialize(): string {
    return String(this._order);
  }

  static deserialize(data: string): Unit {
    return new Unit(parseInt(data));
  }

  static invalid(): Unit {
    return new Unit(-1);
  }

  isValid(): boolean {
    return this._order >= 0;
  }
}
