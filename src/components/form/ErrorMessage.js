import React from "react";
import { StyleSheet } from "react-native";
import AppText from "../AppText";

export default function ErrorMessage({ error, style }) {
  if (!error) return null;
  return <AppText style={[styles.error, style]}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginBottom: 10,
  },
});
