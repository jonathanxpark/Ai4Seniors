import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types'
import { fonts, color } from '../setting';
import Icon from 'react-native-vector-icons/Ionicons';
const ListItem = ({info, onPress, isDelete, onDelete}) => {
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.innterContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.textName}>{info.action}</Text>
                    <Text style={styles.textName}>{info.name}</Text>
                    <Text style={styles.textName}>{info.time}</Text>
                    {/* <Text style={styles.textTopic}>{info.topic}</Text>                                 */}
                </View>
                <View style={styles.trash}>
                    <Icon
                        name='ios-trash-outline'
                        size={40}
                        onPress={onDelete}
                        color={color.primary}/>
                </View>
                
            </View>
                {/*<View style={styles.cirle}>
                    <Text style={styles.cirleText}>{info.name.slice(0,2)}</Text>
                </View>
                
            </View>
            {
                isDelete && (
                    <View style={styles.icon}>
                        <Icon
                            name='ios-trash-outline'
                            size={30}
                            onPress={onDelete}
                            color={color.primary}/>
                    </View>
                )
            }
        */}
        </TouchableOpacity>
    );
};

ListItem.defaultProps = {
    isDelete : true, // If deletable, is true, Otherwise is false.
    onDelete : () => console.log('onDelete'), 
}

ListItem.propTypes = {
    isDelete : PropTypes.bool,
    onDelete : PropTypes.func,
    info : PropTypes.object,
    onPress : PropTypes.func
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: 'white',
        flex: 1,
        marginTop : 10,
        marginBottom : 10,
        marginRight : 20,
        paddingTop : 10,
        paddingRight : 15,
        paddingLeft : 15,
        paddingBottom : 10,
    },
    innterContainer : {
        flexDirection: 'row',
        justifyContent : 'space-between'
    },
    infoContainer : {
        marginRight : 40
    },
    trash : {
         alignItems: 'center',
         justifyContent: 'center',
         paddingTop : 10,
         paddingRight : 15,
     },
    circle : {
       // width: 60,
       // height: 60,
       // backgroundColor : color.primary,
       // borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop : 10,
        paddingRight : 15,
    },
    cirleText : {
        fontFamily: fonts.regular,
        fontSize: 24,
        textAlign: "center",
        color: "#ffffff"
    },
    textTime : {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight : 20,
    },
    textName : {
        fontFamily: fonts.regular,
        fontSize: 18,
        lineHeight : 25,
    },
    textTopic : {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: "#9b9b9b",
        lineHeight : 20,
    },
    icon : {
        alignItems: 'flex-end',
    }
});

export default ListItem;