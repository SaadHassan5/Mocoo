export const ChangeBackgroundColor = (backgroundColor: any) => {
    return {
        type: 'CHANGE_BACKGROUND_COLOR',
        payload: backgroundColor
    };
};
export const CameraImgs = (Imgs: any) => {
    return {
        type: 'Get_Imgs',
        payload: Imgs
    };
};
export const GetUser = (user: any) => {
    return {
        type: 'user',
        payload: user
    };
};
export const GetLn = (ln: any) => {
    return {
        type: 'ln',
        payload: ln
    };
};
export const GetRoute = (routy: any) => {
    return {
        type: 'routy',
        payload: routy
    };
};