import TextField from "./Text";
import BooleanField from "./Boolean";
import ForeignKeyField from "./ForeignKey";
import IntegerField from "./Integer";
import QuantityField from "./Quantity";
import QuantityRangeField from "./QuantityRange";
import SelectField from "./Select";
import RangeField from "./Range";
import DateTimeField from "./DateTime";
import RichTextField from "./RichText";
import ModelChoiceField from "./ModelChoiceField";
import ModelMultipleChoiceField from "./ModelMultipleChoiceField";



const fieldsMapping = {
    undefined: TextField,
    null: TextField,
    // Django fields
    'BooleanField': BooleanField,
    'CharField': TextField,
    'ChoiceField': SelectField,
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
    'IntegerField': TextField,
    'FloatField': TextField,
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
    'RichTextField': RichTextField,
    'HTMLField': RichTextField,
    'QuantityField': QuantityField,
    'QuantityRangeField': QuantityRangeField,
    'RangeField': RangeField,
}

const Field = ({ type, ...props }) => {

    const FieldComponent = fieldsMapping[type] || type
    return <FieldComponent {...props} />
}

export default Field