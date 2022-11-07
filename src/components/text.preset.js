import { colors } from "../theme";
import { typography } from "../theme/typography";


const BASE = {
    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.lightGray
}

const BASE_BOLD = {
    fontFamily: typography.semiBold,
    fontSize: 15,
    color: colors.lightGray
}

const BOLD = {
    fontFamily: typography.bold,
    fontSize: 15,
    color: colors.lightGray
}

export const presets = {
    default: BASE,
    semiBold: BASE_BOLD,
    bold: BOLD,
    h1: {
        ...BOLD,
        fontSize: 32
    },
    h2: {
        ...BOLD,
        fontSize: 28
    },
    h3: {
        ...BASE_BOLD,
        fontSize: 24
    },
    h4: {
        ...BASE_BOLD,
        fontSize: 18
    },
    h5: {
        ...BASE_BOLD,
        fontSize: 14
    },
    small: {
        ...BASE,
        fontSize: 12
    },
}