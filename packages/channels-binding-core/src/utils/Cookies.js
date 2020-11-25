import Cookies from 'universal-cookie';
import _ from 'lodash';

const cookies = new Cookies();

export default {
    get: (name, defaultValue, options) => {
        const value = cookies.get(name, options)
        if (_.isUndefined(value)) { return defaultValue }
        return value
    },
    set: (name, value, options = { path: '/' }) => {
        cookies.remove(name)
        cookies.set(name, value, options)
    },
    unset: (name) => {
        cookies.remove(name)
    },
}