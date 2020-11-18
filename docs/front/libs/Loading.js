import { CircularProgress, Skeleton } from '@material-ui/core';
import icon from 'src/Icon.svg'
import Logo from './Logo'

const css = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: 40,
        width: 40,
        '& > img, & > svg, & > span': {
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate3d(-50%, -50%, 0)'
        },
        '& > svg': {
            width: 35,
        },
        '& > img': {
            width: 45,
        }
    },
    rootCenter: {
        position: 'absolute', top: '50%', left: '50%', zIndex: 9999,
        transform: 'translateY(-50%) translateX(-50%)',
    },
    inline: {
        display: 'inline-block',
    },
}))

export default ({ center, centered, inline, ...props }) => {
    const classes = css()
    return (
        <div className={clsx(
            classes.root,
            inline && classes.inline,
            centered && classes.rootCenter
        )}>
            <Skeleton variant="circular" width={40} height={40} />
            {/* <img src={icon} alt="Logo" /> */}
            <Logo />
            {/* <CircularProgress className={clsx(
                classes.progress,
                center && classes.progressCenter
            )} {...props} /> */}
        </div>
    )
}
