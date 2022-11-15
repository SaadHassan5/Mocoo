const initialState = {
    backgroundColor: 'red',
    user: {},
    updateApp:false,
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

        default:
            return state;
    }
}