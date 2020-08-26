import useSave from './useSave'

const Save = ({ children, ...props }) => children(useSave(props))

export default Save