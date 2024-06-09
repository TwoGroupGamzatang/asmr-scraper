export function combineArrays<T>(
    arr1: T[] | undefined,
    arr2: T[] | undefined,
    arr3?: T[] | undefined
): T[] {
    return [...(arr1 || []), ...(arr2 || []), ...(arr3 || [])];
}
