import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { color, fonts } from '../setting';

const {width, height} = Dimensions.get('window');
const LargeButton = ({title, onPress, style}) => {
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
                <Text style={styles.title}>{title}</Text>                
            </TouchableOpacity>
        </View>
    )
}

LargeButton.defaultProps = {
    title : 'Are you a new user?',
}

const styles = StyleSheet.create({
    container: {
        width : width,
        height : 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer : {
        width : width - (60*2),
        height : 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : color.primary
    },
    title: {
        width: 200,
        height: 60,
        lineHeight : 60 ,
        fontFamily: fonts.regular,
        fontSize: 24,
        textAlign: "center",
        color: "#ffffff"
    }
})

export default LargeButton;