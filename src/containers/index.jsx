/**
 * app入口 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import rootReducer from '../reducers/root.js';
import rootRouter from '../routers/'

import '../styles/global.css';
import '../styles/index.css';

const store = createStore(rootReducer, applyMiddleware(thunk));

let appElem = document.createElement('div');
appElem.className = 'app';
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={rootRouter} />
    </Provider>,
    document.body.appendChild(appElem)
);
