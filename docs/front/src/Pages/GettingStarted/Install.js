import Code from 'src/Code'

export default props => {
    return (<>
        <Code
            title='Simple Reflection'
            description='Illustrate how channels binding handle request with simple reflexion'
            js='Pages/Demo/SimpleReflection'
            py='bindings/simple_reflexion'
        />
        <Code
            title='Asyncio Loop'
            description='Illustrate how asyncio can be used to create a short self reflected loop interaction'
            js='Pages/Demo/AsyncioLoop'
            py='bindings/hunger'
        />
    </>)
}