import useForm from './useForm'

const Form = ({ children, ...props }) => children(useForm(props))

export default Form