import useRetrieve from './useRetrieve'
import useDelete from './useDelete'


const Retrieve = ({
    deletable,
    children,
    ...props
}) => {

    const { stream, data, pk } = props
    if (deletable) {
        const { deleted } = useDelete({ stream, data, pk })
        return deleted ? null : (children ? children(useRetrieve(props)) : null)
    }
    else {
        return children ? children(useRetrieve(props)) : null
    }
}

export default Retrieve