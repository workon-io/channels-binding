import useSearch from './useSearch'

const Search = ({ children, ...props }) => children ? children(useSearch(props)) : null

export default Search