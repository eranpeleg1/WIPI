import * as firebase from "firebase";
import _ from "lodash";

async function storeUserDetails(user) {
    const real = firebase.database();
    const {displayName, email, photoURL} = user
    return real.ref('Users/' + user.uid).set({name: displayName, email, photoURL});
}

const getReports = async (self) => {
    const real = firebase.database();
    const reports = real.ref()
    await reports.once('value', snapshot => {
        const reports = snapshot.val().Reports
        const users = snapshot.val().Users
        let bycicleOfficer = {};
        let parkingOfficer = {};
        let towingTruck = {};
        if(reports!==undefined && reports!==null){
            console.log('reports',reports);

            if(reports.parkingOfficer  ){

                parkingOfficer = _.map(_.values(_.merge(reports.parkingOfficer, reports['parkingOfficer-Locations'],users)),value => {value.reportType='parking officer'; return value})
                }
                if(reports.towingTruck  ){
        
                towingTruck = _.map(_.values(_.merge(reports.towingTruck, reports['towingTruck-Locations'],users)),value => {value.reportType='towing truck'; return value})
                }
                if(reports.bicycleOfficer ){
                    bycicleOfficer = _.map(_.values(_.merge(reports.bicycleOfficer, reports['bicycleOfficer-Locations'], users)),value => {value.reportType='bicycle officer'; return value})
        
                } 
        }

        const allReports = _.filter(_.concat(parkingOfficer, bycicleOfficer, towingTruck),report=> report.l !== undefined)
       if (self.state.reports.length !== allReports.length) {
           self.setState({reports:allReports})
       }

    })
}

export default {
    storeUserDetails,
    getReports
}




