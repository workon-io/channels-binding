const basePath = `${PUBLIC_PATH}API/`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
    }
}

const Routes = props => {

    return <>
        <Route exact path={link('root')} >

        </Route>
    </>
}

export { link, Routes }
export default { link, Routes }