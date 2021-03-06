import React, { Component } from 'react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
// import NavigationBarRender from "../../components/NavigationBarRender";
// import SingleProfileCard from '../../components/SingleProfileCard/SingleProfileCard'
import NavBar from '../../components/NavBar/NavBar';
import { Followers, Container } from './ProfilesPage.styles';
import { MainTitle, } from '../ProjectPage/ProjectPage.styles';
export default class AllProfiles extends Component {

    state = {
        profilesHistory: [],
        profileDetails: [],
        showMine:false,
        showDetail:false,
        list: true,
        card: false,
        

    }

    toggleDetailShow = (details)=> {
        let toggle = this.state.showDetail 
        toggle = this.state.showDetail  ? false : true;
        this.setState ({ showDetail: toggle , profileDetails:details})
     
       }
      
    handleDetailClose=()=>{
          this.setState({
            showDetail:false,
           })
          }


    async componentDidMount(){
        try {
            let fetchProfileResponse = await fetch('api/users/');
            if(!fetchProfileResponse.ok) throw new Error('Could Not Grab Profiles');
            let profiles = await fetchProfileResponse.json();
            this.setState({ profilesHistory: profiles, user:this.props.user});
        } catch(err){
            console.error('Error:', err)// log if error

        }   
    }

    async getProfiles() {
        try {
            let jwt = localStorage.getItem('token');
            let fetchProfileResponse = await fetch('api/users/', { headers: {'Authorization': 'Bearer ' + jwt}});
            if(!fetchProfileResponse.ok) return 'Could NOT Grab Profiles';
            let profiles = await fetchProfileResponse.json();
            this.setState({ profilesHistory: profiles});
        } catch(err){
            console.error('Error:', err)// log if error

        }   
    }

    handleProfileDelete = async (id)=>{
        await this.deleteProfile(id)
        this.getProfiles()
        
      }

    async deleteProfile(id) {
        let profileRes = await fetch('./api/users/',{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id})
        })
        let profile = await profileRes.json()
        return profile
      }


 

 
    
    render(){
        return (
            <React.Fragment>
                {/* <NavigationBarRender/> */}
                <NavBar userLogout={this.props.userLogout} />
                <MainTitle>All Profiles</MainTitle>
                <Followers>
                    <Container>
                    {this.state.profilesHistory.map((profile) => (
                    
                        <ProfileCard key={profile._id} 
                                        {...profile} 
                                        toggleDetailShow={this.toggleDetailShow}
                                        handleDetailClose={this.handleDetailClose} 
                                        handleProfileDelete={this.handleProfileDelete} 
                                        user={this.props.user}
                                        showMine={this.state.showMine}
                                        showDetail={this.state.showDetail}
                                        profileDetails={this.state.profileDetails}
                                       />

                    ))}
            
                    </Container>
                </Followers>
            </React.Fragment>
        );
      }
}