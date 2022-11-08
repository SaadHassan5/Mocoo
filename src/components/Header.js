import { View, TouchableOpacity, Platform, StatusBar, SafeAreaView, Image } from "react-native";
import React from "react";

import { ArrowLeft, Logout } from "../svg";
import AppText from "./AppText";
import { colors } from "../theme";
import { HP, WP } from "../assets/config";
import fontFamily from "../assets/config/fontFamily";

export default function Header({ goBack = true, onPress, title, titleStyle, style, logout, rightOptionTxt, rightOptionPress, leftOptionTxt, leftOptionPress, titleView, img,imgStyle }) {
    return (
        <SafeAreaView
            style={[{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                position: 'relative',
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 5
            }, style]}
        >
            {goBack && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        left: 0,
                        paddingHorizontal: 20,
                        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 5
                    }}
                    onPress={onPress}
                >
                    <ArrowLeft />
                </TouchableOpacity>
            )}
            {rightOptionTxt && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 0,
                        paddingHorizontal: 20,
                        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
                    }}
                    onPress={rightOptionPress}
                >
                    <AppText
                        preset="h4"
                        style={{
                            fontSize: 13,
                            color: colors.black,
                            fontFamily: fontFamily.bold,
                            // textDecorationLine:"underLine",
                            ...titleStyle,
                        }}
                    >{rightOptionTxt}</AppText>
                    {/* <ArrowLeft /> */}
                </TouchableOpacity>
            )}
            {leftOptionTxt && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        left: 0,
                        paddingHorizontal: 20,
                        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
                    }}
                    onPress={leftOptionPress}
                >
                    <AppText
                        preset="h4"
                        style={{
                            fontSize: 13,
                            color: colors.black,
                            fontFamily: fontFamily.bold,
                            // textDecorationLine:"underLine",
                            ...titleStyle,
                        }}
                    >{leftOptionTxt}</AppText>
                    {/* <ArrowLeft /> */}
                </TouchableOpacity>
            )}
            {logout && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        right: 0,
                        paddingHorizontal: WP(5),
                        paddingVertical: WP(5),
                        borderRadius: WP(5),
                        // marginTop:Platform.OS === "android" ? StatusBar.currentHeight : 0,
                        backgroundColor: colors.primary,
                        // marginTop:HP(5)
                        top: HP(2)
                    }}
                    onPress={logout}
                >
                    <Logout />
                </TouchableOpacity>
            )}
            <View style={{ width: WP(65), ...titleView }}>
                {img &&
                    <Image source={{ uri: img }} style={{ ...imgStyle }} />
                }
                <AppText
                    preset="h4"
                    style={{
                        fontSize: 18,
                        color: colors.black,
                        textAlign: 'center',
                        fontFamily: fontFamily.bold,
                        ...titleStyle,
                    }}
                    numberOfLines={1}
                >
                    {title}
                </AppText>
            </View>
        </SafeAreaView>
    );
}
