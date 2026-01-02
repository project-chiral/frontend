import dayjs, { type Dayjs } from 'dayjs';
import type { UnitType } from './unit';
import { UNITS, Unit } from './unit';
import type { UnitIDRange } from './unit-range';

export class UnitID {
  private readonly _date: Dayjs;
  private readonly _unit: Unit;
  private readonly _uid: string;

  constructor(_date: Dayjs, _unit: Unit) {
    this._date = _date;
    this._unit = _unit;

    const uType = this._unit.type;
    let uidInput: number | number[];

    switch (uType) {
      case 'century': {
        const century = Math.floor(this._date.year() / 100);
        uidInput = century;
        break;
      }
      case 'decade': {
        const century = Math.floor(this._date.year() / 100);
        const decade = Math.floor(this._date.year() / 10);
        uidInput = [century, decade];
        break;
      }
      default: {
        const century = Math.floor(this._date.year() / 100);
        const decade = Math.floor(this._date.year() / 10);
        const rest = UNITS.slice(2, this._unit.order + 1).map((unit) =>
          this._date.get(unit as UnitType)
        );
        uidInput = [century, decade, ...rest];
        break;
      }
    }
    this._uid = hash(uidInput);
  }

  static fromDayjs(unit: UnitType | number, dateConfig?: ConfigType): UnitID {
    return new UnitID(
      dayjs(dateConfig),
      Unit.fromUnit(typeof unit === 'number' ? UNITS[unit] : unit)
    );
  }

  static fromDate(date: Date, unit: UnitType | number = 'date'): UnitID {
    return UnitID.fromDayjs(unit, date);
  }

  static now(unit: UnitType | number = 'date'): UnitID {
    return UnitID.fromDayjs(unit, new Date());
  }

  static lowerBound(): UnitID {
    return UnitID.fromDayjs('century', '-271821-01-01');
  }

  static upperBound(): UnitID {
    return UnitID.fromDayjs('century', '275759-12-31');
  }

  static invalid(unit: UnitType | number = 'century'): UnitID {
    return UnitID.fromDayjs(unit, 'invalid');
  }

  static deserialize(str: string): UnitID {
    const [unit, config] = str.split('_');
    const unitOrder = parseInt(unit);
    if (config === undefined || isNaN(unitOrder)) {
      throw new Error('UnitID deserialize: invalid format');
    }
    return UnitID.fromDayjs(unitOrder, config);
  }

  serialize(): string {
    return `${this._unit.serialize()}_${this.format()}`;
  }

  as(unit: UnitType | number): UnitID {
    return new UnitID(
      this._date,
      Unit.fromUnit(typeof unit === 'number' ? UNITS[unit] : unit)
    );
  }

  add(value: number): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }
    const uType = this._unit.type;
    switch (uType) {
      case 'century':
        return new UnitID(this._date.add(value * 100, 'year'), this._unit);
      case 'decade':
        return new UnitID(this._date.add(value * 10, 'year'), this._unit);
      case 'date':
        return new UnitID(this._date.add(value, 'day'), this._unit);
      default:
        return new UnitID(this._date.add(value, uType), this._unit);
    }
  }

  sub(value: number): UnitID {
    return this.add(-value);
  }

  get date(): Dayjs {
    return this._date;
  }

  get unit(): Unit {
    return this._unit;
  }

  get uid(): string {
    return this._uid;
  }

  next(): UnitID {
    return this.add(1);
  }

  prev(): UnitID {
    return this.sub(1);
  }

  diff(date: UnitID, milliSecond = false): number {
    if (!this.isValid() || !date.isValid()) {
      return NaN;
    }

    if (!this._unit.isSame(date._unit)) {
      throw new Error('UnitID diff: unit not match');
    }

    if (milliSecond) {
      return this._date.diff(date._date, 'millisecond');
    }

    const uType = this._unit.type;
    const start = date._date;
    const end = this._date;

    switch (uType) {
      case 'century':
        return Math.floor(end.diff(start, 'year') / 100);
      case 'decade':
        return Math.floor(end.diff(start, 'year') / 10);
      case 'date':
        return end.diff(start, 'day');
      default:
        return end.diff(start, uType);
    }
  }

  get start(): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }

    const uType = this._unit.type;
    switch (uType) {
      case 'century': {
        const century = Math.floor(this._date.year() / 100) * 100;
        return new UnitID(this._date.startOf('year').year(century), this._unit);
      }
      case 'decade': {
        const decade = Math.floor(this._date.year() / 10) * 10;
        return new UnitID(this._date.startOf('year').year(decade), this._unit);
      }
      default:
        return new UnitID(this._date.startOf(uType), this._unit);
    }
  }

  get isStart(): boolean {
    if (!this.isValid()) {
      return false;
    }

    const uType = this._unit.type;
    if (uType === 'century') {
      return this._date.year() % 100 === 0;
    } else if (uType === 'decade') {
      return this._date.year() % 10 === 0;
    } else {
      return this._date.startOf(uType).isSame(this._date);
    }
  }

  get end(): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }

    const uType = this._unit.type;
    switch (uType) {
      case 'century': {
        const century = Math.floor(this._date.year() / 100) * 100 + 99;
        return new UnitID(this._date.endOf('year').year(century), this._unit);
      }
      case 'decade': {
        const decade = Math.floor(this._date.year() / 10) * 10 + 9;
        return new UnitID(this._date.endOf('year').year(decade), this._unit);
      }
      default:
        return new UnitID(this._date.endOf(uType), this._unit);
    }
  }

  get isEnd(): boolean {
    if (!this.isValid()) {
      return false;
    }

    const uType = this._unit.type;
    if (uType === 'century') {
      return this._date.year() % 100 === 99;
    } else if (uType === 'decade') {
      return this._date.year() % 10 === 9;
    } else {
      return this._date.endOf(uType).isSame(this._date);
    }
  }

  get parent(): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }

    const upperUnit = this._unit.upper();
    if (!upperUnit) {
      throw new Error('UnitID parent: century has no parent');
    }
    return this.as(upperUnit);
  }

  get childrenRange(): UnitIDRange {
    if (!this.isValid()) {
      return UnitIDRange.invalid(this.unit);
    }

    const lowerUnit = this._unit.lower();
    if (!lowerUnit) {
      throw new Error('UnitID childrenRange: second has no children');
    }
    const start = this.start.as(lowerUnit);
    const end = this.end.as(lowerUnit);
    return new UnitIDRange(start, end);
  }

  get range(): UnitIDRange {
    if (!this.isValid()) {
      return UnitIDRange.invalid(this.unit);
    }
    return UnitIDRange.fromUnitID(this.parent, this.parent).as(this._unit);
  }

  get children(): UnitID[] {
    if (!this.isValid()) {
      return [];
    }
    return this.childrenRange.ids;
  }

  get firstChild(): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }
    const lowerUnit = this._unit.lower();
    if (!lowerUnit) {
      throw new Error('UnitID firstChild: second has no children');
    }
    return this.start.as(lowerUnit);
  }

  get lastChild(): UnitID {
    if (!this.isValid()) {
      return UnitID.invalid(this.unit);
    }
    const lowerUnit = this._unit.lower();
    if (!lowerUnit) {
      throw new Error('UnitID lastChild: second has no children');
    }
    return this.end.as(lowerUnit);
  }

  toString(): string {
    if (!this.isValid()) {
      return 'invalid';
    }

    const startIdx = this._unit.isLower(Unit.fromUnit('decade')) ? 2 : 0;
    return UNITS.slice(startIdx, this._unit.order + 1)
      .map((unit) => this.as(unit).toUnitString())
      .join('');
  }

  toUnitString(): string {
    if (!this.isValid()) {
      return 'invalid';
    }

    const uType = this._unit.type;
    switch (uType) {
      case 'century':
        return `${Math.floor(this._date.year() / 100) + 1}世纪`;
      case 'decade': {
        const decade = (this._date.year() % 100) - (this._date.year() % 10);
        if (decade === 0) {
          return '年代初';
        } else {
          return `${decade}年代`;
        }
      }
      case 'year':
        return `${this._date.year()}年`;
      case 'month':
        return `${this._date.month() + 1}月`;
      case 'date':
        return `${this._date.date()}日`;
      case 'hour':
        return `${this._date.hour()}时`;
      case 'minute':
        return `${this._date.minute()}分`;
      case 'second':
        return `${this._date.second()}秒`;
    }
  }

  toBriefString(): string {
    if (!this.isValid()) {
      return 'invalid';
    }

    const uType = this._unit.type;
    switch (uType) {
      case 'century':
      case 'year':
        return this.toUnitString();
      case 'decade':
        return `${this.children[0]}代`;
      default:
        return `${this.parent.toUnitString()}${this.toUnitString()}`;
    }
  }

  toJSON(): { unit: number; date: Date | null } {
    if (!this.isValid()) {
      return { unit: 0, date: null };
    }

    return {
      unit: this._unit.order,
      date: this._date.toDate(),
    };
  }

  toDate(): Date {
    return this._date.toDate();
  }

  format(pattern?: string): string {
    if (!this.isValid()) {
      return 'invalid';
    }
    return pattern ? this._date.format(pattern) : this._date.format();
  }

  isBefore(date: UnitID): boolean {
    if (!this.isValid() || !this._unit.isSame(date._unit)) {
      return false;
    }
    return this._date.isBefore(date._date);
  }

  isAfter(date: UnitID): boolean {
    if (!this.isValid() || !this._unit.isSame(date._unit)) {
      return false;
    }
    return this._date.isAfter(date._date);
  }

  isSame(other: UnitID): boolean {
    if (!this.isValid() || !this._unit.isSame(other._unit)) {
      return false;
    }
    const uType = this._unit.type;
    switch (uType) {
      case 'century':
      case 'decade':
        return this._date.isSame(other._date, 'year');
      default:
        return this._date.isSame(other._date, uType);
    }
  }

  isBetween(
    start: UnitID,
    end: UnitID,
    inclusion: '()' | '[]' | '[)' | '(]' = '()'
  ): boolean {
    if (
      !this.isValid() ||
      !this._unit.isSame(start._unit) ||
      !this._unit.isSame(end._unit)
    ) {
      return false;
    }
    if (end._date.isBefore(start._date)) {
      return false;
    }

    const uType = this._unit.type;
    switch (uType) {
      case 'century':
      case 'decade':
        return this._date.isBetween(start._date, end._date, 'year', inclusion);
      default:
        return this._date.isBetween(start._date, end._date, uType, inclusion);
    }
  }

  isValid(): boolean {
    return this._date.isValid() && this._unit.isValid();
  }
}

export { UnitID as default };
