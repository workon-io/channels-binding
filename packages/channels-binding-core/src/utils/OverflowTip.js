import Tooltip from '@material-ui/core/Tooltip';

class OverflowTip extends React.Component {
    constructor(props) {
        super(props);
        this.width = props.width
        this.state = {
            overflowed: false
        };
        this.textElement = React.createRef();
    }

    componentDidMount() {
        this.setState({
            isOverflowed: (
                this.textElement.current.scrollWidth > this.textElement.current.clientWidth
                || (this.width && this.textElement.current.scrollWidth > this.width)
            )
        });
    }

    render() {
        const { isOverflowed } = this.state;
        return (
            <Tooltip
                title={this.props.children}
                disableHoverListener={!isOverflowed}>
                <div
                    ref={this.textElement}
                    style={{
                        // maxWidth: this.props.maxWidth || 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: this.width
                    }}>
                    {this.props.children}
                </div>
            </Tooltip>
        );
    }
}

export default OverflowTip;