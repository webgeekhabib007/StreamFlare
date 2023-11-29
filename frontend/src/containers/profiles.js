import React, {useState, useEffect,useContext}from 'react';
import {useNavigate} from 'react-router-dom';
import { Header, Profiles } from '../components';
import * as ROUTES from '../constants/routes';
import logo from '../logo.svg';
import {AuthContext} from './../context/auth-context';

export function SelectProfileContainer({ email, setProfile, setCategory }) {
    const [profiles, setProfiles] = useState([]);
    const auth = useContext(AuthContext);
    const mp=auth.max_profiles;
    const navigate = useNavigate();

    async function fetchFromAPI (){
        console.log('Hello!');
        
        const url = `http://localhost:5000/api/profiles/${email}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        console.log(profiles);

        setProfiles(data.profile);
        console.log(profiles);

        auth.set_num_profiles(data.profile.length);
        
    }
    
    useEffect ( () => {
        fetchFromAPI();
    }, []);
  
    return ( 
      <>
        <Header bg={false}>
          <Header.Frame>
            <Header.Logo to={ROUTES.HOME} src={logo} alt="Netflix" />
            {profiles.length<auth.max_profiles 
              ?<Header.ButtonLink to={ROUTES.CREATE_PROFILE}>Create Profile</Header.ButtonLink>
              :<><Header.ButtonLink onClick = {() =>{ 
                navigate(ROUTES.SIGN_IN);
                auth.logout();
                console.log("logging23 out");
                 }}>Log Out</Header.ButtonLink></>}
          </Header.Frame>
        </Header>

        <Profiles>
          <Profiles.Title>Who's watching?</Profiles.Title>
          <Profiles.List>
              {profiles.map((name,index)=>{
              return (
                  <Profiles.User onClick = { (event) => {setProfile (name); setCategory('films'); }}>
                      <Profiles.Name >{name.PROFILE_ID}</Profiles.Name>
                      <Profiles.Picture src={index+1}/>
                  </Profiles.User>
              )
              })}
          </Profiles.List>
        </Profiles>
      </>
    
  );
}