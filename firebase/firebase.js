import * as firebase from "firebase";

function storeUserDetails(user) {
    const real = firebase.database();
    const {displayName, email, photoURL} = user
    real.ref('Users/' + user.uid).set({name: displayName, email, photoURL});
}

const getReports = () => {
    const real = firebase.database();
    return real.ref('Reports/');
}


export default{
    storeUserDetails,
    getReports
}