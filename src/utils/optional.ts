export type Optional<T> = T | null;
export type Maybe<T> = T | undefined;

export function nullToUndefined<T>(value: Optional<T>): Maybe<T> {
    return value === null ? undefined : value;
}
