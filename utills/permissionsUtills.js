    import {Platform} from 'react-native';
    import { IntentLauncherAndroid,Location,Linking,Permissions } from 'expo';

    const openLocationSettingsMenu = async () => {
        if(Platform.OS === 'ios'){
            await Linking.openURL('app-settings:') 
        } else {
            await IntentLauncherAndroid.startActivityAsync(
                IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
              );
        }
        return Promise.resolve();
    }      
        const  validateLocationServices = async ()=>{
        let gpsStatus = await Location.getProviderStatusAsync();
        if (gpsStatus.locationServicesEnabled){
            let locationServicesApproved = false;
            while(!locationServicesApproved){
            let {status} = await Permissions.askAsync(Permissions.LOCATION);
            locationServicesApproved = (status === 'granted');
            }
            return Promise.resolve(true);
        } else{
       
            await openLocationSettingsMenu();
        }
    }

    export default {

        validateLocationServices

    }


    