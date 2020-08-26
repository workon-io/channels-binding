import Link from '@material-ui/core/Link';

const DetailsLink = ({
    Details,
    data,
    Update,
    ...props
}) => {
    const [openDetails, setOpenDetails] = React.useState(false);
    const handleCloseDetails = e => setOpenDetails(false);
    const handleRowClick = e => setOpenDetails(true)

    return <>
        <Link href="#" onClick={handleRowClick}>
            {props.children}
        </Link>
        {Details && openDetails && <Details
            setOpenUpdate={Update && setOpenUpdate}
            data={data}
            open={openDetails}
            onClose={handleCloseDetails}
        />}
    </>
}

export default DetailsLink