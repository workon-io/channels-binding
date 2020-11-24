import { useRef } from "react";
import { usePassiveBind } from "@channels-binding/core";

export default () => {

    const ref = useRef()

    useBind('django:high_frequency_realtime_data.subscribe')
    usePassiveBind({
        event: 'django:high_frequency_realtime_data.data',
        observe: data => {
            ref.current.createChild("rect", { x: 30, y: 30, width: "50", height: "50", rx: 5, ry: 5, fill: "green" });
        }
    })

    return <svg ref={ref}>

    </svg>
}
