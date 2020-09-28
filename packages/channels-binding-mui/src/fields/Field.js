import CharField from "./CharField";
import BooleanField from "./Boolean";
import ForeignKeyField from "./ForeignKey";
import IntegerField from "./Integer";
import QuantityField from "./Quantity";
import QuantityRangeField from "./QuantityRange";
import SelectField from "./Select";
import RangeField from "./Range";
import DateTimeField from "./DateTime";
import RichCharField from "./RichText";
import ModelChoiceField from "./ModelChoiceField";
import ModelMultipleChoiceField from "./ModelMultipleChoiceField";
import ChoiceField from './ChoiceField'



const fieldsMapping = {
    undefined: CharField,
    null: CharField,
    // Django fields
    'BooleanField': BooleanField,
    'CharField': CharField,
    'ChoiceField': ChoiceField,
    'TypedChoiceField': SelectField,
    'DateField': DateTimeField,
    'DateTimeField': DateTimeField,
    'DecimalField': IntegerField,
    'DurationField': IntegerField,
    'EmailField': IntegerField,
    // FileField
    // FilePathField
    // FloatField
    // ImageField
    'IntegerField': CharField,
    'FloatField': CharField,
    // JSONField
    // GenericIPAddressField
    // MultipleChoiceField
    // TypedMultipleChoiceField
    // NullBooleanField
    // RegexField
    // SlugField
    'TimeField': DateTimeField,
    // URLField
    // UUIDField
    // ComboField
    // MultiValueField
    // SplitDateTimeField
    'ModelChoiceField': ModelChoiceField,
    'ModelMultipleChoiceField': require('./ModelMultipleChoiceField').default,
    // ModelChoiceIterator
    // ModelChoiceIteratorValue
    // Extra fields
    'RichCharField': RichCharField,
    'HTMLField': RichCharField,
    'QuantityField': QuantityField,
    'QuantityRangeField': QuantityRangeField,
    'RangeField': RangeField,
}

const Field = ({ type, ...props }) => {

    const FieldComponent = fieldsMapping[type] || type
    return <FieldComponent {...props} />
}

export default Field