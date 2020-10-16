const useObserverDebounced = ( value, delay=350 ) => 
{
    const [ debouncedValue, setDebouncedValue ] = React.useState(value);
    React.useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        },
        [value] 
    );
    return debouncedValue
}

export default useObserverDebounced