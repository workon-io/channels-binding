import useRetrieve from './useRetrieve'
import useDelete from './useDelete'



const Retrieve = props => {

    const { stream, data } = props
    const { deleted } = useDelete({ stream, data })
    return deleted ? null : <DeletableRetrieve {...props} />
}

const DeletableRetrieve = ({ children, ...props }) => children(useRetrieve(props))

export default Retrieve