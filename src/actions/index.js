let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //method
    dispatchAction: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('TEST', state));
    },
}

export default actions;