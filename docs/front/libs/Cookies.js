import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default {
    get: (name, defaultValue, options) => {
        const value = cookies.get(name, options)
        if (_.isUndefined(value)) { return defaultValue }
        // TODO: Cast
        // let value = _.parseInt(flatValue)
        // value = _.isNaN(value) ? flatValue : value
        return value
    },
    set: (name, value, options) => {
        cookies.remove(name)
        cookies.set(name, value, options)
    },
    unset: (name) => {
        cookies.remove(name)
    },
}