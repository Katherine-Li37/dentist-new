import React, { Component } from 'react';
import Axios from 'axios';
import Banner from '../Banner';
import DoctorTable from '../DoctorsList/DoctorTable';


export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state ={
            // isLoading: true,
            users:[],
            patients: [],
            doctors: [],
            facilities: [],
            doctorDetails: []
        }
        this.deleteUser = this.deleteUser.bind(this);
        
    }

    componentDidMount() {
        fetch('http://localhost:3000/users/')
        .then(res => res.json())
        .then((data) => {
          this.setState({ users: data })
          this.splitDataGroups();
        })
        .catch(console.log)

        fetch('http://localhost:3000/facilities/')
        .then(res => res.json())
        .then((data) => {
          this.setState({ facilities: data })
        })
        .catch(console.log)
    }

    splitDataGroups(){
        var doctorsList = [];
        var patientsList = [];
        this.state.users.forEach((user) =>{
            if(user.type==="Doctor"){
                doctorsList.push(user);
            }else if (user.type === "Patient"){
                patientsList.push(user);
            }
        });
        this.setState({doctors: doctorsList});
        this.fetchDoctorDetail(doctorsList);
        console.log(patientsList);
        this.setState({patients: patientsList});
    }

    async fetchDoctorDetail(doctor) {
        let newDoctorDetails=[]
        for(let i = 0 ;i< doctor.length;i++){
            const response = await fetch('http://localhost:3000/doctor_details/'+ doctor[i]._id.toString())
            const data = await response.json();
            newDoctorDetails.push(data);
            this.setState({ doctorDetails: newDoctorDetails });
            this.mapFacilityInfoIntoDoctor();
        }
    }

    mapFacilityInfoIntoDoctor(){
        // console.log(this.state);
        var doctorUpdated = [];
        this.state.doctors.forEach((doctor)=>{
            var newDoctor = doctor;
             if (doctor.detail){
                 var index = this.state.facilities.findIndex(facility => facility._id.toString() === doctor.detail.facilities.facilityID.toString());
                newDoctor.facility = this.state.facilities[index];
                doctorUpdated.push(newDoctor);
            }
        });
        this.setState({doctor: doctorUpdated});
    }

    deleteUser(id){
        Axios({
          method: "DELETE",
          url: "http://localhost:3000/users/" + id,
        }).then((res) => {
            console.log(res)
        });
    };



    render() {
        const rows = [];
        this.state.patients.forEach((patient) => {       
            rows.push(
                <tr>
                    <td>{ patient.username }</td>
                    <td>
                        { patient.firstName } { patient.lastName }
                    </td>
                    <td>{ patient.email }</td>
                    <td>{ patient.phone }</td>
                    <td>{ patient.address}, {patient.city}, {patient.state} {patient.zipcode}</td>
                    <td>
                        <button type="button" onClick={() => this.deleteUser(patient._id)}>
                        <i className="fa fa-trash fa-2x"></i>
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <React.Fragment>
                <Banner pageTitle='List of Users' />
                <div class="container new-container">
                    <div className="row">
                        <h1>Doctors</h1>
                        <DoctorTable
                            doctors={this.state.doctors}
                            filterText={this.state.filterText}
                            availableOnly={this.state.availableOnly}
                            facilities={this.state.facilities}
                            doctorDetails={this.state.doctorDetails}
                            admin={true}
                        />
                    </div>

                    <div className="row">
                        <h1>Patients</h1>
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}