import { Some, None, Option } from './option';

describe('Option', () => {
    it('isSome()', () => {
        const x1 = Some(2);
        expect(x1.isSome).toBeTruthy();

        const x2 = None;
        expect(x2.isSome()).toBeFalsy();
    });

    it('isNone()', () => {
        const x1 = Some(2);
        expect(x1.isNone()).toBeFalsy();

        const x2 = None;
        expect(x2.isNone()).toBeTruthy();
    });

    it('contains()', () => {
        const x1 = Some(2);
        expect(x1.contains(2)).toBeTruthy();

        const x2 = Some(3);
        expect(x2.contains(2)).toBeFalsy();

        const x3: Option<number> = None;
        expect(x3.contains(2)).toBeFalsy();
    });

    it('expect()', () => {
        const x1 = Some('value');
        expect(x1.expect('fruits are healthy')).toBe('value');

        const x2 = None;
        expect(() => x2.expect('fruits are healthy')).toThrow('fruits are healthy');
    });

    it('unwrap()', () => {
        const x1 = Some('air');
        expect(x1.unwrap()).toBe('air');

        const x2 = None;
        expect(x2.unwrap).toThrow();
    });

    it('unwrapOr()', () => {
        expect(Some('car').unwrapOr('bike')).toBe('car');
        expect(None.unwrapOr('bike')).toBe('bike');
    });

    it('unwrapOrElse()', () => {
        const k = 10;
        expect(Some(4).unwrapOrElse(() => 2 * k)).toBe(4);
        expect(None.unwrapOrElse(() => 2 * k)).toBe(20);
    });

    it('map()', () => {
        const someString = Some('Hello, World!');
        const someLength = someString.map((s) => s.length);
        expect(someLength).toStrictEqual(Some(13));

        const someNumber: Option<number> = None;
        const someSquare = someNumber.map((n) => n * n);
        expect(someSquare).toStrictEqual(None);
    });

    it('mapOr()', () => {
        const x1 = Some('foo');
        expect(x1.mapOr(42, (v) => v.length)).toBe(3);

        const x2 = None;
        expect(x2.mapOr(42, (v) => v.length)).toBe(42);
    });

    it('mapOrElse()', () => {
        const k = 21;

        const x1 = Some('foo');
        expect(
            x1.mapOrElse(
                () => 2 * k,
                (v) => v.length
            )
        ).toBe(3);

        const x2 = None;
        expect(
            x2.mapOrElse(
                () => 2 * k,
                (v) => v.length
            )
        ).toBe(42);
    });

    it('and()', () => {
        const x1 = Some(2);
        const y1: Option<string> = None;
        expect(x1.and(y1)).toStrictEqual(None);

        const x2: Option<number> = None;
        const y2: Option<string> = Some('foo');
        expect(x2.and(y2)).toStrictEqual(None);

        const x3 = Some(2);
        const y3 = Some('foo');
        expect(x3.and(y3)).toStrictEqual(Some('foo'));

        const x4: Option<number> = None;
        const y4: Option<string> = None;
        expect(x4.and(y4)).toStrictEqual(None);
    });

    it('andThen()', () => {
        const sq = (x: number) => Some(x * x);
        const nope = () => None;

        expect(Some(2).andThen(sq).andThen(sq)).toStrictEqual(Some(16));
        expect(Some(2).andThen(sq).andThen(nope)).toStrictEqual(None);
        expect(Some(2).andThen(nope).andThen(sq)).toStrictEqual(None);
        expect(Some(2).andThen(nope).andThen(nope)).toStrictEqual(None);
    });

    it('filter()', () => {
        const isEven = (n: number) => {
            return n % 2 == 0;
        };

        expect(None.filter(isEven)).toStrictEqual(None);
        expect(Some(3).filter(isEven)).toStrictEqual(None);
        expect(Some(4).filter(isEven)).toStrictEqual(Some(4));
    });

    it('or()', () => {
        const x1 = Some(2);
        const y1 = None;
        expect(x1.or(y1)).toStrictEqual(Some(2));

        const x2 = None;
        const y2 = Some(100);
        expect(x2.or(y2)).toStrictEqual(Some(100));

        const x3 = Some(2);
        const y3 = Some(100);
        expect(x3.or(y3)).toStrictEqual(Some(2));

        const x4 = None;
        const y4 = None;
        expect(x4.or(y4)).toStrictEqual(None);
    });

    it('orElse()', () => {
        const nobody = () => None;
        const vikings = () => Some('vikings');

        expect(Some('barbarians').orElse(vikings)).toStrictEqual(Some('barbarians'));
        expect(None.orElse(vikings)).toStrictEqual(Some('vikings'));
        expect(None.orElse(nobody)).toStrictEqual(None);
    });

    it('xor()', () => {
        const x1 = Some(2);
        const y1: Option<number> = None;
        expect(x1.xor(y1)).toStrictEqual(Some(2));

        const x2: Option<number> = None;
        const y2 = Some(2);
        expect(x2.xor(y2)).toStrictEqual(Some(2));

        const x3 = Some(2);
        const y3 = Some(2);
        expect(x3.xor(y3)).toStrictEqual(None);

        const x4: Option<number> = None;
        const y4: Option<number> = None;
        expect(x4.xor(y4)).toStrictEqual(None);
    });

    it('zip()', () => {
        const x = Some(1);
        const y = Some('hi');
        const z: Option<number> = None;

        expect(x.zip(y)).toStrictEqual(Some([1, 'hi']));
        expect(x.zip(z)).toStrictEqual(None);
    });

    it('zipWith()', () => {
        type Point = {
            x: number;
            y: number;
        };
        const newPoint = (x: number, y: number): Point => {
            return { x, y };
        };

        const x = Some(17.5);
        const y = Some(42.7);

        expect(x.zipWith(y, newPoint)).toStrictEqual(Some(newPoint(17.5, 42.7)));
        expect(x.zipWith(None, newPoint)).toStrictEqual(None);
    });
});
