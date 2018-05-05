import React from 'react';
import moment from 'moment';

class Today extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            today: this.today()
        }
        this.timer = null;
    }
    today = () => ({
        date: moment().format(this.props.dateFormat || 'YYYY-MM-DD'),
        week: moment().format(this.props.weekFormat || 'ddd'),
        weekOfYear: moment().format('w'),
        time: moment().format('HH:mm')
    })
    componentWillMount () {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.setState({
                today: this.today()
            })
        }, 1000);
    }
    componentWillUnmount () {
        clearInterval(this.timer);
    }
    render() {
        const { hideTime, hideWeekOfYear } = this.props;
        const thisState = this.state;
        const today = thisState.today;
        return (
            <div className={this.props.className}>
                <span className="date pull-left">{today.date} {hideWeekOfYear ? '' : `第${today.weekOfYear}周 `}{today.week}</span>
                {
                    hideTime ?
                    null :
                    <span className="time pull-right">{today.time}</span>
                }
            </div>
        )
    }
}

export default Today;