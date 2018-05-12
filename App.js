import React from 'react';

import Splash from './Splash.js'
import Home from './Home.js'
import Login from './Login.js'
import * as firebase from "firebase/index";
import * as firestore from 'firebase/firestore';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            nextPage:'splash'
        }
        this.handler = this.handler.bind(this);
    }

    storeUserDetails(userId, name) {
        const fire = firebase.firestore();
        const real = firebase.database();
        const settings = {timestampsInSnapshots: true};
        fire.settings(settings);
        fire.collection("Users").doc(userId).set({name});
        real.ref('Users/' + userId).set({name});

    }

    handler(){
        console.log("handler: "+this);
        firebase.auth().onAuthStateChanged((user)=>{
            let nextPage='login';
            if (user !==null) {
                if (this.state.nextPage==='login'){
                    this.storeUserDetails(user.uid, user.displayName)
                }
                nextPage='home';
            }
            this.setState({nextPage});
        })
    }

    componentWillMount(){
        //const settings = {timestampsInSnapshots: true};
        //firebase.firestore().settings(settings);
        const firebaseConfig = {

            apiKey: "AIzaSyBKJ88od7dHfemmN5hcCxRpGGABybq_h2k",
            authDomain: "wipi-cee66.firebaseapp.com",
            databaseURL: "https://wipi-cee66.firebaseio.com",
            projectId: "wipi-cee66",
            storageBucket: "wipi-cee66.appspot.com",
        };
        firebase.initializeApp(firebaseConfig);
    }

    render() {
        let page;
        switch (this.state.nextPage) {
            case 'splash':
                page=<Splash handler = {this.handler}/>;
                break;
            case 'login':
                page=<Login handler = {this.handler}/>;
                break;
            case 'home':
                page=<Home/>;
                break;
        }
        return (
            page
        )
    }
}