import { useBind, usePassiveBind } from "@channels-binding/core";
import Paper from '@material-ui/core/Paper';

export default () => {

    const { data: sos } = useBind('back1:asyncio_loop.sos')
    const food = usePassiveBind('back1:asyncio_loop.food')

    return <Paper >
        <h2>A mini game sample, Hungry Server:</h2>
        &nbsp;
        <Life percent={sos.life} />
        &nbsp;
        <button onClick={food.dispatch} disable={!sos.life} >
            Feed the server!
        </button>
        &nbsp;
        <b>
            <i>{sos.message} {sos.life > 0 && '!'.repeat(100 - sos.life)}</i>
        </b>
    </Paper >

}

const Life = ({
    percent = 100
}) => <span
    style={{
        position: 'relative',
        overflow: 'hidden',
        fontSize: 20,
        whiteSpace: 'nowrap',
        color: '#bbb',
        verticalAlign: 'middle'
    }}
>
        <span style={{
            color: 'red',
            position: 'absolute',
            overflow: 'hidden',
            width: `${percent}%`,
            transition: 'width 2s linear'
        }}>
            ❤❤❤❤❤❤❤❤❤❤
    </span>
        <span>
            ❤❤❤❤❤❤❤❤❤❤
        </span>
    </span>
