import { Option } from './option';

export class Result<T, E> {
    private constructor(private readonly value: T, private readonly error: E) {
        //
    }

    static Ok<T>(value: T) {
        return new Result(value, undefined);
    }

    static Err<E>(err: E) {
        return new Result(undefined, err);
    }

    isOk(): boolean {
        return this.value !== undefined;
    }

    isErr(): boolean {
        return this.value === undefined;
    }

    contains(x: T): boolean {
        if (this.isErr()) {
            return false;
        }
        return this.value === x;
    }

    containsErr(error: E): boolean {
        if (this.isErr()) {
            return this.error === error;
        }
        return false;
    }

    ok(): Option<T> {
        if (this.isErr()) {
            return Option.None;
        }
        return Option.Some(this.value);
    }

    err(): Option<E> {
        if (this.isErr()) {
            return Option.Some(this.error);
        }
        return Option.None;
    }

    map<U>(op: (value: T) => U): Result<U, E> {
        if (this.isErr()) {
            return Result.Err<E>(this.error);
        }
        return Result.Ok(op(this.value));
    }

    mapOr<U>(defaultValue: U, func: (value: T) => U): U {
        return this.mapOrElse(() => defaultValue, func);
    }

    mapOrElse<U>(defaultFunc: (error: E) => U, func: (value: T) => U): U {
        if (this.isErr()) {
            return defaultFunc(this.error);
        }
        return func(this.value);
    }

    mapErr<F>(func: (error: E) => F): Result<T, F> {
        if (this.isErr()) {
            return Result.Err(func(this.error));
        }
        return Result.Ok(this.value);
    }

    and<U>(result: Result<U, E>): Result<U, E> {
        return this.andThen(() => result);
    }

    andThen<U>(func: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isErr()) {
            return Result.Err(this.error);
        }
        const result = func(this.value);
        if (result.isErr()) {
            return Result.Err(result.error);
        }
        return Result.Ok(result.value);
    }

    or<F>(result: Result<T, F>): Result<T, F> {
        return this.orElse(() => result);
    }

    orElse<F>(func: (error: E) => Result<T, F>): Result<T, F> {
        if (this.isErr()) {
            const result = func(this.error);
            if (result.isErr()) {
                return Result.Err(result.error);
            }
            return Result.Ok(result.value);
        }
        return Result.Ok(this.value);
    }

    unwrapOr(defaultValue: T): T {
        return this.unwrapOrElse(() => defaultValue);
    }

    unwrapOrElse(func: (error: E) => T): T {
        if (this.isErr()) {
            return func(this.error);
        }
        return this.value;
    }

    unwrap(): T {
        if (this.isErr()) {
            throw new Error('called `Result.unwrap()` on an `Err` value');
        }
        return this.value;
    }

    expectErr(message: string): E {
        if (this.isErr()) {
            return this.error;
        }
        throw new Error(message);
    }

    unwrapErr(): E {
        if (this.isErr()) {
            return this.error;
        }
        throw new Error('called `Result.unwrapErr()` on an `Ok` value');
    }
}

export const Ok = Result.Ok;

export const Err = Result.Err;
