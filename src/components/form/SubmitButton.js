import React from "react";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";
import { useNavigation } from '@react-navigation/native';
import { CustomBtn1 } from "../../assets/components/CustomButton/CustomBtn1";

function SubmitButton({ title, style }) {
  const { handleSubmit } = useFormikContext();
  const navigation = useNavigation();

  return <CustomBtn1 style={style} txt={title} onPress={handleSubmit} />;
}

export default SubmitButton;