import React from 'react'
import base64 from 'base-64'
import { View, StyleSheet, AsyncStorage} from 'react-native'
import { apiClient } from '../services/api';
import Header from '../components/Header';
import { SafeAreaView } from 'react-navigation';
import LargeButton from '../components/LargeButton';
import Button from '../components/Button';
import TextInputComp from '../components/TextInputComp';
import ErrorMessage from '../components/ErrorMessage';

class LogIn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'trudi@gmail.com',
            password: 'abc',
            passowrdMismatch: false
        }
        if (props.navigation && props.navigation.state && props.navigation.state.params) {
            this.state.email = props.navigation.state.params.email
        }
    }

    makeHandler = (name) => (text) => {
        this.setState({ [name]: text })
    }

    handleLogin = async () => {
        this.setState({ passowrdMismatch : false });
        const user = Object.assign({}, this.state)
        user.password = base64.encode(user.password)
        //console.log("user:", user)
        const response = await apiClient('auth/login', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(user)
        })
        if (!response.ok) {
            console.log('login failed');
            this.setState({ passowrdMismatch : true });
            return
        }

        //Save the JSON web token
        const { token, ageGroup, id } = await response.json()
        try {
            await AsyncStorage.setItem('@letsunite:jwt', token)
            //console.log("AgeGroup : " + ageGroup)
            await AsyncStorage.setItem('@letsunite:ageGroup', ageGroup)
        } catch(err) {
            console.log("fail setting")
            //TODO Print an error
            console.error(err)
            return
        }

        isSenior = (ageGroup == '55 or more' ? true : false);
        teacherId = isSenior ? user.email : '';
        studentId = isSenior ? '' : user.email;

        console.log("** Login user:", user.email, ", token:", token, ",id:", id);
        const { navigate } = this.props.navigation
        navigate('Home', { email: user.email, isSenior: isSenior, id: id,
            teacherId: teacherId, studentId: studentId, name: user.name })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title='Login' mode='normal' onPress={() => this.props.navigation.navigate('Main')}/>
                {/* <TextInput
                    label="Email"
                    value={this.state.email}
                    onChange={this.makeHandler('email')}
                />
                <TextInput
                    label="Password"
                    value={this.state.password}
                    onChange={this.makeHandler('password')}
                />*/}
                <View style={{ marginTop : 100, marginBottom : 50}}>
                    <TextInputComp
                        placeholder='hello@mail.com'
                        type='email-address'
                        icon='ios-mail-outline'
                        defaulttext=''
                        onChangeText={(text) => this.setState({ email : text})}
                        value={this.state.email}/>

                    <TextInputComp
                        defaulttext=''
                        placeholder='**********'
                        type='email-address'
                        icon='ios-lock-outline'
                        onChangeText={(text) => this.setState({ password : text})}
                        value={this.state.password}
                        isSecure={true}/>
                    
                    {/* TODO: Need to show error msg when the id/password do not match. */}
                    {
                    this.state.passowrdMismatch && 
                    <ErrorMessage/>
                    }
                </View>
                <LargeButton title='Sign In' onPress={this.handleLogin} style={{marginBottom : 20}}/>
                <Button
                    title='Forgot Password?'
                    onPress={() => this.props.navigation.navigate('ForgotPwdScreen')}
                    color='#000000'/>   
    
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : 'white',
    }
})

LogIn.navigationOptions = {
    gesturesEnabled: false,
}

export default LogIn