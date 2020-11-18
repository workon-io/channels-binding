import { useBind, usePassiveBind } from "@channels-binding/core";

export default () => {

    const { data: sos } = useBind('django:hunger.sos')
    const food = usePassiveBind('django:hunger.food')

    return <div >
        Hungry Server:
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
    </div >

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
