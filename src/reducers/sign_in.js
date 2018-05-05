/**
 *  
 */

let initState = {
    test: '',
}

let newState;

function signInReducer (state = initState, action) {
    switch (action.type) {
        case 'TEST':
            newState = Object.assign({}, state, {test: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default signInReducer;