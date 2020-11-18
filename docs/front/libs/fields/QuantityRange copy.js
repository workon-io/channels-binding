import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 0),
        paddingTop: 0,
    },
    label: {
        position: 'relative',
        color: theme.palette.info.main,
    },
    rangeInputs: {
        display: 'flex'
    },
    input: {
        marginTop: 0,
        padding: 0,
    },
    inputInput: {
        paddingBottom: 3
    },
    adornmentStart: {
        fontSize: 11,
        marginTop: 1,
        color: theme.palette.info.main,
    },
    adornmentEnd: {
        fontSize: 12,
        color: theme.palette.text.disabled
    },
    rootSlider: {
        padding: '0px 25px',
    },
    inactive: {
        opacity: 0.6,
        filter: 'grayscale(100%)'
    },
    sliderLabel: {
        position: 'relative',
        // textAlign: 'center',
        marginLeft: -17,
        marginBottom: -10,
        color: theme.palette.info.main,
    },
    slider: {
        marginBottom: 10
    },
    thumb: {
        backgroundColor: theme.palette.info.main,
        transition: theme.transitions.create(['backgroundColor', 'fontWeight'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    track: {
        backgroundColor: theme.palette.info.main,
        transition: theme.transitions.create(['backgroundColor', 'fontWeight'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    markLabel: {
        marginTop: -3,
        fontSize: 12,
        transition: theme.transitions.create(['color', 'fontWeight'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    markLabelActive: {
        color: theme.palette.info.main,
        // fontWeight: 'bold'
    },
    units: {
        fontSize: 10,
        //fontStyle: 'italic'
    }
}));

const QuantityRange = props => {
    const {
        label,
        value,
        units,
        scale,
        min,
        max,
        step,
        body,
        helpText,
        onChange,
        onClear,
    } = props
    const classes = useStyles();

    if (onChange) {

        const [mode, setMode] = React.useState(null)
        const [computedValue, setComputedValue] = React.useState(
            _.isArray(value) ? _.map(value, value => value * scale) : [null, null]
        );
        const isActive = computedValue[0] != min || computedValue[1] != max
        const handleCommittedChange = (e, value) => {
            setComputedValue(value);
            value[0] == min && value[1] == max ? onChange(null) : onChange(_.map(value, value => value / scale));
        };

        const marks = _.map(_.range(min, max, body || _.range(min, max).length / 5), value => ({
            value: value,
            label: `${value}${units || ''}`,
        }));
        marks.push({
            value: max,
            label: `${max}${units || ''}`,
        });
        const valuetext = value => `${value}${units || ''}`;

        React.useEffect(() => {
            _.isUndefined(value) && setComputedValue([min, max]);
        }, [value]);

        if (mode === 'slider') {

            const handleChange = (e, value) => setComputedValue(value);

            return (<div className={clsx(classes.sliderRoot, !isActive && classes.inactive)}>
                <Typography className={classes.sliderLabel}>
                    {label}
                </Typography>
                <Slider
                    classes={{
                        root: classes.slider,
                        thumb: classes.thumb,
                        track: classes.track,
                        markLabel: classes.markLabel,
                        markLabelActive: classes.markLabelActive
                    }}
                    value={computedValue}
                    onChange={handleChange}
                    onChangeCommitted={handleCommittedChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    marks={marks}
                    step={step}
                    min={min}
                    max={max}
                />
            </div>);
        }
        else {
            const handleChange = index => value => {
                const [min, max] = computedValue
                handleCommittedChange(null, index == 0 ? [value, max] : [min, value])
            }
            return <div className={classes.root}>
                <Typography className={classes.label}>
                    {label}
                </Typography>
                <div className={classes.rangeInputs}>
                    <QuantityField label='min' value={computedValue[0] || ''} onChange={handleChange(0)} />
                    <QuantityField label='max' value={computedValue[1] || ''} onChange={handleChange(1)} />
                </div>
            </div>
        }



    }
    else {
        let computedValue = value
        if (_.isArray(value) && value.length == 2) {
            const min = value[0] * scale
            const max = value[1] * scale
            const andOper = value => value < 0 ? value : `+${value}`
            computedValue = <span>
                {andOper(min)}/{andOper(max)}
                {units && <span className={classes.units}>{units}</span>}
            </span>
        }

        const computedLabel = <span>
            {label && <span className={classes.label}>{label}: </span>}
            {computedValue || (label ? 'n/a' : '')}
        </span>
        return <Tooltip title={`Scalar value: ${value}`}>
            {computedLabel}
        </Tooltip>
    }
};

QuantityRange.defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    scale: 1,
    units: null,
    body: null,
};

export default QuantityRange;