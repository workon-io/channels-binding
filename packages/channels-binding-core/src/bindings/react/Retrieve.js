import useRetrieve from './useRetrieve'
import useDelete from './useDelete'


const Retrieve = ({
    deletable,
    ...props
}) => {

    const { stream, data, pk } = props
    if (deletable) {
        const { deleted } = useDelete({ stream, data, pk })
        return deleted ? null : children(useRetrieve(props))
    }
    else {
        return children(useRetrieve(props))
    }
}

export default Retrieve