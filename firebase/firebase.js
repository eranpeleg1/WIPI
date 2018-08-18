import * as firebase from "firebase";

function storeUserDetails(userId, name) {
    const fire = firebase.firestore();
    const real = firebase.database();
    const settings = {timestampsInSnapshots: true};
    fire.settings(settings);
    fire.collection("Users").doc(userId).set({name});
    real.ref('Users/' + userId).set({name});
}


export{
    storeUserDetails,

}
