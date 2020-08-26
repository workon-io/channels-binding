const operators = {
    '<': 'lt',
    '<=': 'lte',
    '>': 'gt',
    '>=': 'gte',
    '==': 'exact',
    '~': 'icontains',
};
const UNITS = {
    'Ω': { 'MΩ': 100000, 'kΩ': 1000, 'mΩ': 1 / 100, __alt__: 'ohm' },
    'g': { 'kg': 1000, 'mg': 1 / 1000, 'ng': 1 / 10000 },
    'm': { 'km': 1000, 'cm': 1 / 100, 'mm': 1 / 1000, 'nm': 1 / 10000 },
    'm2': { 'cm2': 1000, 'cm2': 1 / 100, 'mm2': 1 / 1000, 'nm2': 1 / 10000 },
    'm3': { 'cm3': 1000, 'mm3': 1 / 1000, 'nm3': 1 / 10000 },
    'A': { 'kA': 1000, },
    'V': { 'MV': 100000, 'kV': 1000, 'mV': 1 / 100, 'nV': 1 / 1000, 'uV': 1 / 10000 },
    'Hz': { 'GHz': 100000, 'MHz': 100000, 'kHz': 1000, 'mHz': 1 / 100 },
    's': { 'm': 60, 'h': 3600 },
};
_.map(UNITS, (scales, scalar) => {
    _.map(scales, (scale, key) => {
        UNITS[key] = UNITS[scalar]
        scales[key[0]] = scale
    })
    UNITS[scalar].__scalar__ = scalar
    UNITS[scalar][scalar] = 1
})
// console.log(UNITS)

const sequence = /(?<oper>[!<>=~]+)?\s*(?<value>[\d\,\.]+)(?<forcedUnits>\s*[a-zA-Z]+)?/g;

function quantify(value, units) {

    const valueUnits = _.isUndefined(value) ? [null, units] : _.toString(value).split(' ', 2)
    value = valueUnits[0]
    units = valueUnits[1] || units

    const quantity = {
        input: { value, units },
        scalar: { value, units },
        best: { value, units },
        error: null
    }
    return quantity


    const { input, scalar, best } = quantity
    const unit = UNITS[units]
    if (!unit) {
        quantity.error = 'Units invalid'
        return quantity
    }
    scalar.units = unit.__scalar__

    const results = _.toString(value).replace(',', '.').matchAll(sequence)
    for (let result of results) {
        const { oper, value, forcedUnits } = result.groups
        const scale = forcedUnits ? unit[forcedUnits] || unit[forcedUnits[0]] : unit[units]
        scalar.value = parseFloat(value) * scale
        best.value = parseFloat(value)
        best.units = units
        input.value = parseFloat(value)
        input.units = units

        // console.log(oper, value, forcedUnits, scale)
        break
    }
    // console.log(value, metric)
    // try {
    //     return {
    //         value: ,
    //         units: 
    //     }
    // } catch (error) { 
    //     console.error(value, error)
    // }
    return quantity
}

export default quantify