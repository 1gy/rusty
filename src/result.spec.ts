import { Ok, Result, Err } from './result';
import { Some, None } from './option';

describe('Result', () => {
    it('isOk()', () => {
        const x1: Result<number, string> = Ok(-3);
        expect(x1.isOk()).toBeTruthy();

        const x2: Result<number, string> = Err('Some error message');
        expect(x2.isOk()).toBeFalsy();
    });

    it('isErr()', () => {
        const x1: Result<number, string> = Ok(-3);
        expect(x1.isErr()).toBeFalsy();

        const x2: Result<number, string> = Err('Some error message');
        expect(x2.isErr()).toBeTruthy();
    });

    it('contains()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(x1.contains(2)).toBeTruthy();

        const x2: Result<number, string> = Ok(3);
        expect(x2.contains(2)).toBeFalsy();

        const x3: Result<number, string> = Err('Some error message');
        expect(x3.contains(2)).toBeFalsy();
    });

    it('containsErr()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(x1.containsErr('Some error message')).toBeFalsy();

        const x2: Result<number, string> = Err('Some error message');
        expect(x2.containsErr('Some error message')).toBeTruthy();

        const x3: Result<number, string> = Err('Some other error message');
        expect(x3.containsErr('Some error message')).toBeFalsy();
    });

    it('ok()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(x1.ok()).toStrictEqual(Some(2));

        const x2: Result<number, string> = Err('Nothing here');
        expect(x2.ok()).toStrictEqual(None);
    });

    it('err()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(x1.err()).toStrictEqual(None);

        const x2: Result<number, string> = Err('Nothing here');
        expect(x2.err()).toStrictEqual(Some('Nothing here'));
    });

    it('map()', () => {
        const x1: Result<string, string> = Ok('foo');
        expect(x1.map((v) => v.length)).toStrictEqual(Ok(3));

        const x2: Result<string, string> = Err('bar');
        expect(x2.map((v) => v.length)).toStrictEqual(Err('bar'));
    });

    it('mapOr()', () => {
        const x1: Result<string, string> = Ok('foo');
        expect(x1.mapOr(42, (v) => v.length)).toBe(3);

        const x2: Result<string, string> = Err('bar');
        expect(x2.mapOr(42, (v) => v.length)).toBe(42);
    });

    it('mapOrElse()', () => {
        const x1: Result<string, string> = Ok('foo');
        expect(
            x1.mapOrElse(
                (e) => e.length,
                (v) => v.length
            )
        ).toBe(3);

        const x2: Result<string, string> = Err('error message');
        expect(
            x2.mapOrElse(
                (e) => e.length,
                (v) => v.length
            )
        ).toBe(13);
    });

    it('mapErr()', () => {
        const toMessage = (e: number) => `error: ${e}`;

        const x1: Result<number, number> = Ok(2);
        expect(x1.mapErr(toMessage)).toStrictEqual(Ok(2));

        const x2: Result<number, number> = Err(13);
        expect(x2.mapErr(toMessage)).toStrictEqual(Err('error: 13'));
    });

    it('and()', () => {
        const x1: Result<number, string> = Ok(2);
        const y1: Result<string, string> = Err('late error');
        expect(x1.and(y1)).toStrictEqual(Err('late error'));

        const x2: Result<number, string> = Err('early error');
        const y2: Result<string, string> = Ok('late error');
        expect(x2.and(y2)).toStrictEqual(Err('early error'));

        const x3: Result<number, string> = Err('not a 2');
        const y3: Result<string, string> = Err('late error');
        expect(x3.and(y3)).toStrictEqual(Err('not a 2'));

        const x4: Result<number, string> = Ok(2);
        const y4: Result<string, string> = Ok('different result type');
        expect(x4.and(y4)).toStrictEqual(Ok('different result type'));
    });

    it('andThen()', () => {
        const sq = (x: number): Result<number, number> => Ok(x * x);
        const err = (x: number): Result<number, number> => Err(x);

        expect(Ok(2).andThen(sq).andThen(sq)).toStrictEqual(Ok(16));
        expect(Ok(2).andThen(sq).andThen(err)).toStrictEqual(Err(4));
        expect(Ok(2).andThen(err).andThen(sq)).toStrictEqual(Err(2));
        expect(Err(3).andThen(sq).andThen(sq)).toStrictEqual(Err(3));
    });

    it('or()', () => {
        const x1: Result<number, string> = Ok(2);
        const y1: Result<number, string> = Err('late error');
        expect(x1.or(y1)).toStrictEqual(Ok(2));

        const x2: Result<number, string> = Err('early error');
        const y2: Result<number, string> = Ok(2);
        expect(x2.or(y2)).toStrictEqual(Ok(2));

        const x3: Result<number, string> = Err('not a 2');
        const y3: Result<number, string> = Err('late error');
        expect(x3.or(y3)).toStrictEqual(Err('late error'));

        const x4: Result<number, string> = Ok(2);
        const y4: Result<number, string> = Ok(100);
        expect(x4.or(y4)).toStrictEqual(Ok(2));
    });

    it('orElse()', () => {
        const sq = (x: number): Result<number, number> => Ok(x * x);
        const err = (x: number): Result<number, number> => Err(x);

        expect(Ok(2).orElse(sq).orElse(sq)).toStrictEqual(Ok(2));
        expect(Ok(2).orElse(err).orElse(sq)).toStrictEqual(Ok(2));
        expect(Err(3).orElse(sq).orElse(err)).toStrictEqual(Ok(9));
        expect(Err(3).orElse(err).orElse(err)).toStrictEqual(Err(3));
    });

    it('unwrapOr()', () => {
        const x1: Result<number, string> = Ok(9);
        expect(x1.unwrapOr(2)).toBe(9);

        const x2: Result<number, string> = Err('error');
        expect(x2.unwrapOr(2)).toBe(2);
    });

    it('unwrapOrElse()', () => {
        const count = (x: string) => x.length;

        expect(Ok(2).unwrapOrElse(count)).toBe(2);
        expect(Err('foo').unwrapOrElse(count)).toBe(3);
    });

    it('unwrap()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(x1.unwrap()).toBe(2);

        const x2: Result<number, string> = Err('emergency failure');
        expect(() => x2.unwrap()).toThrow();
    });

    it('expectErr()', () => {
        const x1: Result<number, string> = Ok(10);
        expect(() => x1.expectErr('Testing expectErr')).toThrow('Testing expectErr');

        const x2: Result<number, string> = Err('error');
        expect(x2.expectErr('Testing expectErr')).toBe('error');
    });

    it('unwrapErr()', () => {
        const x1: Result<number, string> = Ok(2);
        expect(() => x1.unwrapErr()).toThrow();

        const x2: Result<number, string> = Err('emergency failure');
        expect(x2.unwrapErr()).toBe('emergency failure');
    });
});
