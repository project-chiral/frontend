import type { UnitID } from './unit-id';
import { Unit, type UnitType } from './unit';

export class UnitIDRange {
  private readonly _start: UnitID;
  private readonly _end: UnitID;

  constructor(start: UnitID, end: UnitID) {
    if (start.isAfter(end)) {
      throw new Error('UnitIDRange: start cannot be after end');
    }
    this._start = start;
    this._end = end;
  }

  static fromDayjs(unit: UnitType | number, start: string, end: string): UnitIDRange {
    const UnitCtor = typeof unit === 'number' ? Unit.fromUnit(unit) : Unit.fromUnit(unit);
    return new UnitIDRange(
      new UnitID(dayjs(start), UnitCtor),
      new UnitID(dayjs(end), UnitCtor)
    );
  }

  static fromUnitID(start: UnitID, end: UnitID): UnitIDRange {
    return new UnitIDRange(start, end);
  }

  static fromTimestamps(unit: UnitType | number, start: number, end: number): UnitIDRange {
    return UnitIDRange.fromDayjs(unit, new Date(start).toISOString(), new Date(end).toISOString());
  }

  static invalid(unit: UnitType | number = 'date'): UnitIDRange {
    const UnitCtor = typeof unit === 'number' ? Unit.fromUnit(unit) : Unit.fromUnit(unit);
    return new UnitIDRange(
      UnitID.invalid(UnitCtor),
      UnitID.invalid(UnitCtor)
    );
  }

  get start(): UnitID {
    return this._start;
  }

  get end(): UnitID {
    return this._end;
  }

  toDateRange(): { start: Date; end: Date } {
    return {
      start: this._start.toDate(),
      end: this._end.toDate(),
    };
  }

  contains(id: UnitID): boolean {
    return !id.isBefore(this._start) && !id.isAfter(this._end);
  }

  overlaps(other: UnitIDRange): boolean {
    return !this._start.isAfter(other._end) && !this._end.isBefore(other._start);
  }

  serialize(): string {
    return `${this._start.serialize()}-${this._end.serialize()}`;
  }

  static deserialize(data: string): UnitIDRange {
    const [start, end] = data.split('-');
    return new UnitIDRange(
      UnitID.deserialize(start),
      UnitID.deserialize(end)
    );
  }

  clone(): UnitIDRange {
    return new UnitIDRange(this._start, this._end);
  }

  duration(): number {
    return this._end.valueOf() - this._start.valueOf();
  }

  valueOf(): number {
    return this.duration();
  }

  get ids(): UnitID[] {
    const ids: UnitID[] = [];
    let current = this._start;
    const end = this._end;

    while (!current.isAfter(end)) {
      ids.push(current);
      current = current.next();
    }
    return ids;
  }

  as(unit: UnitType | number): UnitIDRange {
    return new UnitIDRange(
      this._start.as(unit),
      this._end.as(unit)
    );
  }

  expand(amount: number): UnitIDRange {
    return new UnitIDRange(
      this._start.sub(amount),
      this._end.add(amount)
    );
  }

  shrink(amount: number): UnitIDRange {
    return new UnitIDRange(
      this._start.add(amount),
      this._end.sub(amount)
    );
  }

  get length(): number {
    return this.ids.length;
  }

  isValid(): boolean {
    return this._start.isValid() && this._end.isValid();
  }
}

import dayjs from 'dayjs';
export { UnitIDRange as default };
