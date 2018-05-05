/**
 
 */

let initState = {
    testState: '',
}

let newState;

function homeReducer (state = initState, action) {
    switch (action.type) {
        case 'TEST':
            newState = Object.assign({}, state, {testState: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default homeReducer;