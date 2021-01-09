
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { materialLight as djangoTheme, materialLight as reactTheme, } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { googlecode as djangoTheme, googlecode as reactTheme, } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import CodeIcon from '@material-ui/icons/Code';
import ReactLogo from 'assets/react-logo.png';
import DjangoLogo from 'assets/django-logo.png';
import { Tabs } from 'libs'

export default ({ title, description, js, py }) => {

    const classes = useStyles()
    const Component = require(`src/${js}`).default
    const handleCodeClick = e => { }

    return <>
        <Card className={classes.card}>
            <CardHeader
                className={classes.title}
                title={title}
                subheader={description}
                action={
                    <IconButton onClick={handleCodeClick}>
                        <CodeIcon />
                    </IconButton>
                }
            />
            <CardContent><Component /></CardContent>
        </Card>
        <Grid container spacing={2}>
            <Grid item sm={6}>
                <ReactCodeBloc code={js} />
            </Grid>
            <Grid item sm={6}>
                <DjangoCodeBloc code={py} />
            </Grid>
        </Grid>
    </>
}
const DjangoCodeBloc = ({ code }) => {

    !_.isArray(code) && (code = [{ label: '', name: code }])

    const codes = _.map(code, code => {
        return {
            name: code.name,
            label: code.label,
            raw: require(`!!raw-loader!back/${code.name}.py?raw`).default
        }
    })

    const classes = useStyles()
    return <Card className={classes.card}>
        <CardHeader
            className={classes.title}
            title={<img className={classes.logo} django src={DjangoLogo} />}
        />
        {_.map(codes, ({ label, raw }) => {
            return <SyntaxHighlighter showLineNumbers wrapLines language={"python"} style={djangoTheme}>{raw}</SyntaxHighlighter>
        })}
    </Card>
}

const ReactCodeBloc = ({ code }) => {

    !_.isArray(code) && (code = [{ label: '', name: code }])
    const codes = _.map(code, code => {
        return {
            name: code.name,
            label: code.label,
            raw: require(`!!raw-loader!src/${code.name}.js?raw`).default
        }
    })
    console.log(codes)

    const classes = useStyles()
    return <Card className={classes.card}>
        <CardHeader
            className={classes.title}
            title={<img className={classes.logo} src={ReactLogo} />}
        />
        {_.map(codes, ({ label, raw }) => {
            return <SyntaxHighlighter showLineNumbers wrapLines language={"javascript"} style={reactTheme}>{raw}</SyntaxHighlighter>
        })}
    </Card>
}

const useStyles = makeStyles(theme => ({
    card: {
        position: 'sticky',
        marginBottom: 15,
        '& pre ': {
            margin: '0 !important'
        }
    },
    title: {

    },
    logo: {
        height: 30,
        verticalAlign: 'middle',

    }
}));