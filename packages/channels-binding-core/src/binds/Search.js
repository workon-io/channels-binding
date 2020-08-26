import useSearch from './useSearch'

const Search = ({ children, ...props }) => children(useSearch(props))

export default Search