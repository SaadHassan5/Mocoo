
const getFNameMessage = () => {
    return {
        status: false,
        message: 'enter_fname'
    }
}
const getLNameMessage = () => {
    return {
        status: false,
        message: 'enter_lname'
    }
}
const getMblMessage = () => {
    return {
        status: false,
        message: 'enter_mobile_number'
    }
}
const getMblInvalidMessage = () => {
    return {
        status: false,
        message: 'invalid_mobile_number'
    }
}
const getDOBMessage = () => {
    return {
        status: false,
        message: 'enter_dob'
    }
}
const getGenderMessage = () => {
    return {
        status: false,
        message: 'enter_gender'
    }
}
const getMaritalMessage = () => {
    return {
        status: false,
        message: 'enter_mstatus'
    }
}
const getEmailMessage = () => {
    return {
        status: false,
        message: 'enter_email'
    }
}
const getInvalidEmailMessage = () => {
    return {
        status: false,
        message: 'invalid_email'
    }
}
export const validateProfileFields = (payload) => {
    console.log(payload);
    if (!payload.first_name?.trim()) {
        return getFNameMessage();
    } else if (!payload.last_name?.trim()) {
        return getLNameMessage();
    } else if (!payload.dob?.trim()) {
        return getDOBMessage();
    } else if (!payload.gender?.trim()) {
        return getGenderMessage();
    } else if (!payload.marital_status?.trim()) {
        return getMaritalMessage();
    } else if (!payload.country?.trim()) {
        return {
            status: false,
            message: 'enter_nationality'
        }
    }
    else if (!payload?.mob_number?.trim()) {
        return getMblMessage();
    }
    else if (!validatePhoneNumber(payload.mob_number)) {
        return getMblInvalidMessage();
    } else if (!payload.emergency_number?.trim()) {
        return {
            status: false,
            message: 'enter_emrnumber'
        }
    }
    else if (!(payload.email?.trim())) {
        return getEmailMessage();
    }
    else if (!validateEmail(payload.email)) {
        return {
            status: false,
            message: 'invalid_email'
        }
    }
    else if (!payload.civil_id?.trim()) {
        return {
            status: false,
            message: 'enter_civilId'
        }
    }

    else if (!payload.area?.trim()) {
        return {
            status: false,
            message: 'enter_area'
        }
    }
    else if (!payload.block?.trim()) {
        return {
            status: false,
            message: 'enter_block'
        }
    }
    else if (!payload.street?.trim()) {
        return {
            status: false,
            message: 'enter_street'
        }
    }
    else if (!payload.avenue?.trim()) {
        return {
            status: false,
            message: 'enter_avenue'
        }
    }
    else if (!payload.house_no?.trim()) {
        return {
            status: false,
            message: 'enter_house'
        }
    } else if (!payload.occupation?.trim()) {
        return {
            status: false,
            message: 'enter_occupation'
        }
    } else if (!payload.company_name?.trim()) {
        return {
            status: false,
            message: 'enter_company'
        }
    } else if (!payload.business_tel?.trim()) {
        return {
            status: false,
            message: 'enter_business'
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}





export const validateSignUpFields = (payload) => {

    if (!payload.firstName?.trim()) {
        return {
            status: false,
            message: 'enter_fname'
        }
    } else if (!payload.lastName?.trim()) {
        return {
            status: false,
            message: 'enter_lname'
        }
    }
    else if (!payload.mobileNumber.trim()) {
        return {
            status: false,
            message: 'enter_mobile_number'
        }
    }
    else if (!validatePhoneNumber(payload.mobileNumber)) {
        return {
            status: false,
            message: 'invalid_mobile_number'
        }
    }
    else if (!(payload.emailId.trim())) {
        return getEmailMessage();
    }
    else if (!validateEmail(payload.emailId)) {
        return {
            status: false,
            message: 'invalid_email'
        }
    }
    else if (!payload.civilId?.trim()) {
        return {
            status: false,
            message: 'enter_civilId'
        }
    }
    else if (!payload.password?.trim()) {
        return {
            status: false,
            message: 'enter_password'
        }
    }
    else if (!payload.confirmPassword?.trim()) {
        return {
            status: false,
            message: 'enter_cpassword'
        }
    }
    else if (payload.confirmPassword !== payload.password) {
        return {
            status: false,
            message: "password_not_match"
        }
    }
    else if (!payload.dOB?.trim()) {
        return {
            status: false,
            message: 'enter_dob'
        }
    }
    else if (!payload.gender?.trim()) {
        return {
            status: false,
            message: 'enter_gender'
        }
    } else if (!payload.marital?.trim()) {
        return {
            status: false,
            message: 'enter_mstatus'
        }
    }
    else if (!payload.nationality?.trim()) {
        return {
            status: false,
            message: 'enter_nationality'
        }
    } else if (!payload.emergency?.trim()) {
        return {
            status: false,
            message: 'enter_emrnumber'
        }
    }
    else if (!payload.area?.trim()) {
        return {
            status: false,
            message: 'enter_area'
        }
    }
    else if (!payload.block?.trim()) {
        return {
            status: false,
            message: 'enter_block'
        }
    }
    else if (!payload.street?.trim()) {
        return {
            status: false,
            message: 'enter_street'
        }
    }
    else if (!payload.avenue?.trim()) {
        return {
            status: false,
            message: 'enter_avenue'
        }
    }
    else if (!payload.house?.trim()) {
        return {
            status: false,
            message: 'enter_house'
        }
    } else if (!payload.occupation?.trim()) {
        return {
            status: false,
            message: 'enter_occupation'
        }
    } else if (!payload.companyName?.trim()) {
        return {
            status: false,
            message: 'enter_company'
        }
    } else if (!payload.businessTelNo?.trim()) {
        return {
            status: false,
            message: 'enter_business'
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}
export const validateFreezeFields = (payload) => {
    if (!payload?.start_date) {
        return {
            status: false,
            message: 'enter_start_date'
        }
    } else if (!payload?.end_date) {
        return {
            status: false,
            message: 'enter_end_date'
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}
export const validateSignInFields = (payload) => {
    if (!payload.username.trim()) {
        return {
            status: false,
            message: "enter_mobile_number"
        }
    }
    else if (!validateEmail(payload.mobileNumber)) {
        return {
            status: false,
            message: "invalid_email"
        }
    }
    else if (!payload.password?.trim()) {
        return {
            status: false,
            message: "enter_password"
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}
export const validateForgotFields = (payload) => {

    if (!payload.memberShipId.trim()) {
        return {
            status: false,
            message: 'Oops! It seems you forgot to enter membership id'
        }
    }
    else if (!payload.civilId.trim()) {
        return {
            status: false,
            message: 'Oops! It seems you forgot to enter civil id'
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}
export const validateContactUsFields = (payload) => {
    if (!payload.fullName.trim()) {
        return {
            status: false,
            message: 'enter_full_name'
        }
    }
    else if (!payload.mobile.trim()) {
        return getMblMessage();
    } else if (!validatePhoneNumber(payload.mobile)) {
        return getMblInvalidMessage();
    }
    else if (!payload.emailId.trim()) {
        return getEmailMessage();
    }
    else if (!validateEmail(payload.emailId)) {
        return getInvalidEmailMessage();
    }
    else if (!payload.option.trim()) {
        return {
            status: false,
            message: 'enter_option'
        }
    }
    else if (!payload.club.trim()) {
        return {
            status: false,
            message: 'enter_club'
        }
    }
    else if (!payload.comments.trim()) {
        return {
            status: false,
            message: 'enter_comments'
        }
    }
    return {
        status: true,
        message: 'OK'
    }
}
const validatePhoneNumber = (phoneNumber) => {
    var patt = new RegExp(/^\+(965|966|968|971|973|974)[569][0-9]{7}$/);
    return patt.test(phoneNumber);
};
const validateEmail = (mail) => {
    var patt = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    return patt.test(mail);
}

export const _returnError = (error) => {
    if (error?.response?.request) {
        let { _response } = error?.response?.request;
        console.log('Factory Error Reponse :: ', JSON.parse(_response));
        // return _response?.message
        return JSON.parse(_response)?.message
            ? JSON.parse(_response)?.message.toString()
            :
            error.message?.toString();
    } else {

        if (error?.message) {
            if (error?.message === 'Network Error') {
                return 'Network Error'
                //   return isArabic()?'خطأ في الشبكة':'Network Error'
            }
            else {
                return error.message?.toString();
            }
        } else {
            return error?.toString();
        }
    }
};

