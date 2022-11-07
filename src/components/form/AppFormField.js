import React from "react";
import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        placeholderText={name}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      {touched[name] && <ErrorMessage error={errors[name]} />}
    </>
  );
}

export default AppFormField;
