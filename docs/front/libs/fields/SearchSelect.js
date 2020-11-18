// import Autocomplete from '@material-ui/lab/Autocomplete';
// import TextField from '@material-ui/core/TextField';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import { useSearch } from '@channels-binding/core'

// const styles = makeStyles(theme => ({
//     root: {
//         // padding: theme.spacing(0, 1),
//         paddingTop: 0,
//     },
//     input: {
//         marginTop: 0,
//         padding: 0,
//     },
//     inputInput: {
//         paddingBottom: 3
//     },
// }));

// const SearchSelect = ({
//     label,
//     stream,
//     onChange,
//     helpText,
//     errors,
//     multiple,
//     getValue
// }) => {

//     const classes = styles();

//     const [filters, setFilters] = React.useState({})
//     const [page, setPage] = React.useState(1)
//     const [limit, setLimit] = React.useState(20)
//     const [order, setOrder] = React.useState(null)
//     const { data, fetching } = useSearch({
//         stream,
//         params: { page, limit, order, ...filters },
//         listen: [page, limit, order, filters],
//     })
//     const { count, rows, } = data
//     const handleChange = (e, item) => {
//         if (onChange) {
//             onChange(getValue ? getValue(item) : item)
//         }
//     }

//     return <div className={classes.root}>
//         <FormControl
//             fullWidth
//             className={classes.formControl}
//             error={Boolean(errors)}
//         >
//             <Autocomplete
//                 multiple={multiple}
//                 options={data.rows || []}
//                 // defaultValue={[]}
//                 onChange={handleChange}
//                 getOptionLabel={row => row.name}
//                 // style={{ width: 300 }}
//                 classes={{
//                     root: classes.input,
//                     input: classes.inputInput,
//                 }}
//                 renderInput={(params) => <TextField
//                     {...params}
//                     label={label}
//                 />}
//             />
//             {errors && _.map(errors, error => <FormHelperText>{error}</FormHelperText>)}
//         </FormControl>
//     </div>
// }

// export default SearchSelect