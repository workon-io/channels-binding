import useBind from './useBind'

const Retrieve = ({ children, ...props }) => children(useBind(props))

export default Retrieve