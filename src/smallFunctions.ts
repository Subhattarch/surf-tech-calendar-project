import { defaultArray } from "./types";

const getDaysInMonth = (month: number, year: number): number =>
    new Date(year, month + 1, 0).getDate();

const ArrayInRange = (start: number, range: number): Array<number> =>
    Array.from({ length: range }, (x: never, i: number): number => i + start);

const isObject = (vallue: unknown): boolean => {
    return (
        typeof vallue === "object" &&
        vallue instanceof Object &&
        !(vallue instanceof Array)
    );
};

const DefaultArray = <type>(
    dfault: type,
    Value?: Array<type>
): defaultArray<type> => {
    const array: Array<type> = Value ?? [];
    const Default = dfault;
    return ((index?: number, value?: type): type | type[] => {
        if (index == null) return array;
        array[index] = array[index] ?? Default;
        if (value != null) {
            array[index] = value;
            return array;
        }
        return array[index];
    }) as defaultArray<type>;
};

export { getDaysInMonth, ArrayInRange, isObject, DefaultArray };
