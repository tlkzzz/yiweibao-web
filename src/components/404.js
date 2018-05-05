/**
 * 404
 */
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class NotFound extends React.Component {
    render () {
        return (
            <div 
                style={
                    {
                        position:'absolute',
                        top:0,
                        left:0,
                        width:'100%',
                        height:'100%',
                        lineHeight:'100%',
                        textAlign:'center',
                        fontSize:'66px',
                        color:'#009688',
                        paddingTop:'1rem',
                    }
                }
                onClick={() => browserHistory.push('/')}>
                    404
            </div>
        )
    }
}

export default connect()(NotFound);