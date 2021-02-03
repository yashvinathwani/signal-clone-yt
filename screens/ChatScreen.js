import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet , Text , View , TouchableOpacity , SafeAreaView , ScrollView , TextInput , Keyboard } from "react-native";
import { Avatar } from 'react-native-elements';
import { AntDesign , FontAwesome ,Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as firebase from 'firebase'
import { auth , db } from '../firebase';

const chatScreen = ({ navigation , route }) => {
    const [ input , setInput ] = useState("");
    const [ messages , setMessages ] = useState([]); 

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection("chats").doc(route.params.id).collection("messages").add({
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
            message : input,
            displayName : auth.currentUser.displayName,
            email : auth.currentUser.email,
            photoURL : auth.currentUser.photoURL,
        });

        setInput("");
    }

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection("chats")
            .doc(route.params.id)
            .collection("messages")
            .orderBy("timestamp" , "asc")
            .onSnapshot((snapshot) => 
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id : doc.id,
                        data : doc.data(),
                    }))
                )
            );

        return unsubscribe;
    }, [route])

    useLayoutEffect(() => {
        const length = messages.length - 1;
        navigation.setOptions({
            title : "Chat",
            headerTitle : () => (
                <View style={styles.headertitle}>
                    <Avatar 
                        rounded 
                        source={{ 
                            uri : messages[length]?.data.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png"
                        }} 
                    />
                    <Text style={styles.text}>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft : () => (
                <TouchableOpacity style={styles.back} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={34} color="white" />
                </TouchableOpacity>
            ),
            headerRight : () => (
                <View style={styles.icons}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name="phone" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )
        })
    } , [navigation , messages ])

    return(
        <SafeAreaView style={{flex : 1 , backgroundColor : "white"}}>
            <StatusBar style="light" />
            <View
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={90}
            >
            <> 
                <ScrollView contentContainerStyle={{ paddingTop : 15 }}>
                    {messages.map(({ id , data }) => 
                        data.email === auth.currentUser.email ? (
                            <View key={id} style={styles.receiver}>
                                <Avatar 
                                    // for WEB
                                    containerStyle={{
                                        position : "absolute",
                                        bottom : -15,
                                        right : -5,
                                    }}
                                    rounded
                                    size={30}
                                    position="absolute"
                                    bottom={-15}
                                    right={-5}
                                    source = {{ uri : data.photoURL }}
                                />
                                <Text style={styles.receiverText}>{data.message}</Text>
                            </View>
                        ) : (
                            <View key={id} style={styles.sender}>
                                <Avatar 
                                    containerStyle={{
                                        position : "absolute",
                                        bottom : -15,
                                        left : -5,
                                    }}
                                    rounded
                                    size={30}
                                    position="absolute"
                                    bottom={-15}
                                    left={-5}
                                    source = {{ uri : data.photoURL }}    
                                />
                                <Text style={styles.senderText}>{data.message}</Text>
                                <Text style={styles.senderName}>{data.displayName}</Text>
                            </View>
                        )
                    )}
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput 
                        placeholder="Signal Message" 
                        style={styles.textinput}
                        value={input}
                        onChangeText={text => setInput(text)}
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                        <Ionicons name="send" size={24} color="#2B68E6" />
                    </TouchableOpacity>    
                </View>
            </>
            </View>
        </SafeAreaView>
    )
}

export default chatScreen;

const styles = StyleSheet.create({
    headertitle : {
        flexDirection : "row",
        alignItems : "center",
    },
    text : {
        color : "white",
        marginLeft : 10,
        fontWeight : "900",
        fontSize : 20,
    },
    back : {
        marginLeft : 10,
    },
    icons : {
        flexDirection : "row",
        justifyContent : "space-between",
        width : 80,
        marginRight : 20,
    },
    container : {
        flex : 1,
    },
    footer : {
        flexDirection : "row",
        alignItems : "center",
        width : "100%",
        padding : 15,
    },
    textinput : {
        bottom : 0,
        height : 40,
        flex : 1,
        marginRight : 15,
        backgroundColor : "#ECECEC",
        padding : 10,
        color : "grey",
        borderRadius : 30,
    },
    receiver : {
        padding : 15,
        backgroundColor : "#ECECEC",
        alignSelf : "flex-end",
        borderRadius : 20,
        marginRight : 15,
        marginBottom : 20,
        maxWidth : "80%",
        position : "relative",
    },
    sender : {
        padding : 15,
        backgroundColor : "#2B68E6",
        alignSelf : "flex-start",
        borderRadius : 20,
        margin : 15,
        maxWidth : "80%",
        position : "relative",
    },
    senderName : {
        left : 10,
        paddingRight : 10,
        fontSize : 10,
        color : "white",
    },
    senderText : {
        color : "white",
        fontWeight : "500",
        marginLeft : 10,
        marginBottom : 15,
    },
    receiverText : {
        color : "black",
        fontWeight : "500",
        marginLeft : 10,
    },
})