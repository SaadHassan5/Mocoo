export const ChangeBackgroundColor = (backgroundColor: any) => {
    return {
        type: 'CHANGE_BACKGROUND_COLOR',
        payload: backgroundColor
    };
};

export const GetUser = (user: any) => {
    return {
        type: 'user',
        payload: user
    };
}
export const GetUpdateApp = (updateApp: any) => {
    return {
        type: 'updateApp',
        payload: updateApp
    };
}
export const GetUpdateAppClose = (updateAppClose: any) => {
    return {
        type: 'updateAppClose',
        payload: updateAppClose
    };
}