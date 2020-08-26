import useDelete from './useDelete'

const Delete = ({ children, ...props }) => {

    const { deleted, ...results } = useDelete(props)
    return children(results)
}
export default Delete