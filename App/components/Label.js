import React from 'react'
import { StyleSheet, Text } from 'react-native'

const Label = (props) => {
    const { text } = props
    return (
        <Text 
            style={[
                styles.label,
                { fontSize : props.size || 26 },
                { marginBottom : 20},
                { alignItems: 'center'},
            ]}
        >
            {text}
        </Text>
    )
}

const styles = StyleSheet.create({
    label: {
        color: 'black',
        height : 63,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Label