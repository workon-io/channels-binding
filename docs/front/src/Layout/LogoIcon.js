import SvgIcon from '../Icon.svg'
import theme from '../theme'
export default () => {

    return <img height="45" src={SvgIcon}
        style={{
            borderRadius: '50%',
            background: theme.palette.primary.main,
            boxShadow: 'inset 0px 0px 7px 2px #313131'
        }} />
}