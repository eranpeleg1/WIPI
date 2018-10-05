import { Permissions, Notifications } from 'expo';
export  const registerForPushNotificationsAsync = async (userId) => {
    console.log("Entered to the push notifications registration.");

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }
    console.log("before.");
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    console.log("after.");
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    fetch("https://us-central1-wipi-cee66.cloudfunctions.net/addPushTokenByUser", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "userId": userId,
            "expoPushToken": token
        })
    }).then(response => {
        console.log(response)
    });
}
