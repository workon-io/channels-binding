import CharField from "./CharField";
import BooleanField from "./Boolean";
import ForeignKeyField from "./ForeignKey";
import IntegerField from "./Integer";
import QuantityField from "./Quantity";
import QuantityRangeField from "./QuantityRange";
import SelectField from "./Select";
import RangeField from "./Range";
import DateTimeField from "./DateTime";
import ModelChoiceField from "./ModelChoiceField";
import ModelMultipleChoiceField from "./ModelMultipleChoiceField";
import ChoiceField from './ChoiceField'



const fieldsMapping = {
    undefined: CharField,
    null: CharField,
    'BooleanField': BooleanField,
    'CharField': CharField,
    'ChoiceField': ChoiceField,
    'TypedChoiceField': SelectField,
    'DateField': DateTimeField,
    'DateTimeField': DateTimeField,
    'DecimalField': IntegerField,
    'DurationField': IntegerField,
    'EmailField': IntegerField,
    'IntegerField': CharField,
    'FloatField': CharField,
    'TimeField': DateTimeField,
    'ModelChoiceField': ModelChoiceField,
    'ModelMultipleChoiceField': require('./ModelMultipleChoiceField').default,
    'QuantityField': QuantityField,
    'QuantityRangeField': QuantityRangeField,
    'RangeField': RangeField,
}

const Field = ({ type, ...props }) => {

    const FieldComponent = fieldsMapping[type] || type
    return <FieldComponent {...props} />
}

export default Field