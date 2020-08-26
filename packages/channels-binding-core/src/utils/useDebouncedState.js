import useDebounced from './useDebounced' 

const useDebouncedState = ( defaultValue, delay=350 ) => 
{
    const [ value, setValue ] = React.useState( defaultValue )
    return [ value, useDebounced( value, delay ), setValue ] 
}

export default useDebouncedState