export class Option<T> {
    private constructor(private readonly value: T) {
        //
    }

    static get None() {
        return new Option(undefined);
    }

    static Some<T>(value: T) {
        return new Option(value);
    }

    isSome(): boolean {
        return this.value !== undefined;
    }

    isNone(): boolean {
        return this.value === undefined;
    }

    contains(x: T): boolean {
        if (this.isNone()) {
            return false;
        }
        return this.value === x;
    }

    expect(msg: string): T {
        if (this.isNone()) {
            throw new Error(msg);
        }
        return this.value;
    }

    unwrap(): T {
        return this.expect('called  `Option.unwrap()` on a `None` value');
    }

    unwrapOr(defaultValue: T): T {
        return this.unwrapOrElse(() => defaultValue);
    }

    unwrapOrElse(func: () => T): T {
        if (this.isNone()) {
            return func();
        }
        return this.value;
    }

    map<U>(func: (value: T) => U): Option<U> {
        if (this.isNone()) {
            return Option.None;
        }
        return Option.Some(func(this.value));
    }

    mapOr<U>(defaultValue: U, func: (value: T) => U): U {
        return this.mapOrElse(() => defaultValue, func);
    }

    mapOrElse<U>(defaultValue: () => U, func: (value: T) => U): U {
        if (this.isNone()) {
            return defaultValue();
        }
        return func(this.value);
    }

    and<U>(option: Option<U>): Option<U> {
        return this.andThen(() => option);
    }

    andThen<U>(func: (value: T) => Option<U>): Option<U> {
        if (this.isNone()) {
            return Option.None;
        }
        return func(this.value);
    }

    filter(predicate: (value: T) => boolean): Option<T> {
        if (this.isNone() || !predicate(this.value)) {
            return Option.None;
        }
        return this;
    }

    or(option: Option<T>): Option<T> {
        return this.orElse(() => option);
    }

    orElse(func: () => Option<T>): Option<T> {
        if (this.isNone()) {
            return func();
        }
        return this;
    }

    xor(option: Option<T>): Option<T> {
        if (this.isSome() && option.isNone()) {
            return this;
        }
        if (this.isNone() && option.isSome()) {
            return option;
        }
        return Option.None;
    }

    zip<U>(other: Option<U>): Option<[T, U]> {
        return this.zipWith(other, (t, u) => [t, u]);
    }

    zipWith<U, R>(other: Option<U>, func: (t: T, u: U) => R): Option<R> {
        if ((this.isSome(), other.isSome())) {
            return Option.Some(func(this.value, other.value));
        }
        return Option.None;
    }
}

export const None = Option.None;

export const Some = Option.Some;
