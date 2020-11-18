import { Slider, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        // padding: '0px 25px',
    },
    inactive: {
        opacity: 0.6,
        filter: 'grayscale(100%)'
    },
    label: {
        position: 'relative',
        // textAlign: 'center',
        marginLeft: -17,
        marginBottom: -10
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
    }
}));

function RangeField({
    label,
    units,
    defaultValue,
    divider,
    min,
    max,
    step,
    showStep,
    showLast,
    onChange,
}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(_.isArray(defaultValue) ? _.map(defaultValue, value => value * divider) : [min, max]);
    const isActive = value[0] != min || value[1] != max

    React.useEffect(() => {
        _.isUndefined(defaultValue) && setValue([min, max]);
    }, [defaultValue]);

    const marks = _.map(_.range(min, max, showStep), value => ({
        value: value,
        label: `${value}${units}`,
    }));
    if (showLast) {
        marks.push({
            value: max,
            label: `${max}${units}`,
        });
    }

    const valuetext = value => `${value}${units}`;

    // event handler
    const handleCommittedChange = (e, newValue) => {
        setValue(newValue);
        if (newValue[0] == min && newValue[1] == max) {
            return onChange(null);
        }
        return onChange(_.map(newValue, value => value / divider));
    };
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return <div className={clsx(classes.root, !isActive && classes.inactive)}>
        <Typography className={classes.label}>
            {label}
        </Typography>
        <Slider
            // className={classes.slider}
            classes={{
                root: classes.slider,
                thumb: classes.thumb,
                track: classes.track,
                markLabel: classes.markLabel,
                markLabelActive: classes.markLabelActive
            }}
            value={value}
            onChange={handleChange}
            onChangeCommitted={handleCommittedChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            marks={marks}
            step={step}
            min={min}
            max={max}
        />
    </div>
}

RangeField.defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    showStep: 20,
    divider: 1,
    units: '%',
    showLast: true,
    isRisk: false,
};

export default RangeField;