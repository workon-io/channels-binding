// import CategoryTree from "../../Categories/Tree";
// import Chip from '@material-ui/core/Chip';
// import Tooltip from '@material-ui/core/Tooltip';

// const Categories = props => {
//     const {
//         label,
//         data,
//         value,
//         onChange,
//         onMove,
//     } = props;

//     // const [ categories, setCategories ] = React.useState(_.map(value, CategoryTree.state.name));
//     // React.useEffect(() => {
//     //     setCategories(_.map(value, CategoryTree.state.name));
//     // }, [ CategoryTree.state.categories ]);

//     console.log('Rebuild catégories')

//     if (onChange) {
//         return <CategoryTree
//             // selected={value} 
//             onChange={onChange}
//             onMove={onMove}
//             data={data}
//         />

//     }
//     else if (onClear) {

//         return (<Chip
//             size="small"
//             label={`${label}: ${_.join(data, "+")}`}
//             clickable
//             onDelete={onClear}
//         />);


//     } else {

//         return (<Tooltip title={`DB value ${value}`}><span>{
//             showLabel ?
//                 <> {label}:&nbsp;<b>{value}</b> </>
//                 : <> <b>{value}</b> </>
//         }</span></Tooltip>);

//     }
// }

// export default Categories;