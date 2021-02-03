import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet , View , TouchableOpacity} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { Button , Input , Text } from 'react-native-elements'
import * as ImagePicker from "expo-image-picker";
import { auth } from  '../firebase';
import { AntDesign , FontAwesome ,Ionicons } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }) => {
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [imageUrl , setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle : "Login",
        });
    } , [navigation])

    // useEffect(() => {
    //     (async () => {
    //         if(Platform.OS !== "web") {
    //             const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //             if(status !== "granted") {
    //                 alert("Sorry , we need gallery permission to upload your picture");
    //             }
    //         }
    //     })();
    // }, [])

    const register = () => {
        auth.createUserWithEmailAndPassword(email , password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName : name,
                photoURL : imageUrl || "https://i.pinimg.com/originals/01/b5/68/01b568d0371f5efb4b722aaa8d9fd13d.jpg"
            })
        })
        .catch((error) => alert(error.message))
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.All,
        });

        console.log(result);

        if(!result.cancelled) {
            setImageUrl(result.uri);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text h3 style={{marginBottom : 50}}>Create a Signal account</Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder = "Full Name"
                    autoFocus
                    type = "text"
                    value={name}
                    onChangeText = {(text) => setName(text)}
                />
                <Input
                    placeholder = "Email"
                    type = "email"
                    autoCapitalize = "none"
                    value={email}
                    onChangeText = {(text) => setEmail(text)}
                />
                <Input
                    placeholder = "Password"
                    type = "password"
                    autoCapitalize = "none"
                    secureTextEntry
                    value={password}
                    onChangeText = {(text) => setPassword(text)}
                />
                <Input
                    placeholder = "Profile Picture (optional)"
                    type = "text"
                    value={imageUrl}
                    onChangeText = {(text) => setImageUrl(text)}
                    onSubmitEditing = {register}
                />
                <FontAwesome name="image" size={38} style={styles.image}  />
            </View>
            
            <Button 
                containerStyle = {styles.button}
                title = "Register"
                raised
                onPress = {register}
            /> 
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        padding : 10,
        backgroundColor : "white",
    },
    inputContainer : {
        width : 300,  
    },
    button : {
        width : 200,
        marginTop : 10,
    },
    image : {
        marginLeft : 245, 
        marginBottom : 40, 
        marginTop : -66,
    }
})