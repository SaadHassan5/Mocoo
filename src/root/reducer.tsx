const initialState = {
    backgroundColor: 'red',
    user: {},
    updateApp:false,
    updateAppClose:false,
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {

        case 'CHANGE_BACKGROUND_COLOR':
            return {
                ...state,
                backgroundColor: action.payload
            }

        case 'user':
            return {
                ...state,
                user: action.payload
            }
            case 'updateApp':
            return {
                ...state,
                updateApp: action.payload
            }
            case 'updateAppClose':
            return {
                ...state,
                updateAppClose: action.payload
            }

        default:
            return state;
    }
}