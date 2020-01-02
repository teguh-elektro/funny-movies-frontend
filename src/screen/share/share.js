import React from 'react';
import { FaHome } from "react-icons/fa";
import {Link, Route, Redirect} from 'react-router-dom'
import axios from 'axios'

const API_URL = "http://18.233.99.1:3100"

class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            url: '',
            isSend: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    
    async getDataYoutube(id){
        try{
            const response = await axios({
                method: 'get',
                url: 'https://www.googleapis.com/youtube/v3/videos',
                params: {
                  part: "snippet",
                  key: 'AIzaSyApCy9eVPhWHQC_32uJDRX-tbwCSlHjWys',
                  id: id
                }
            });

            const data = await response.data.items[0].snippet.localized;
            return(data)
        }catch(error){
            
        }
    }

    async sendLogout(){
        try{
            let email = localStorage.getItem('email');
            let id = localStorage.getItem('id');
            const response = await axios({
                method: 'delete',
                url: API_URL+'/user',
                data: {
                  email: email,
                  id: id
                }
              });
              console.log(response);
              localStorage.setItem("Login", '0');
              this.setState({
                isLogin: '0'
              }) 
              return( <Route path="/" />);
        }catch(error){

        }
    }

    handleChange(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
    
        this.setState({
        [name]: value
        });
    }

    async newMovie (){
        try{
            const youtube_id = this.state.url.split("v=")
            console.log(youtube_id);
            let id = localStorage.getItem('id');
            const data = await this.getDataYoutube(youtube_id[1])
            console.log(data);
            const text = data.description.substr(0, 254);
            const response = await axios({
                method: 'post',
                url: API_URL+'/movie',
                data: {
                  link: youtube_id[1],
                  id: id,
                  description: text,
                  title: data.title
                }
              });
              this.setState({
                isSend: 1
              })
        }catch(error){
            console.log(error);
        }
    }

    render(){
        const user = localStorage.getItem('email');
      return (
        <div>
          {(this.state.isSend == '1')&&<Redirect push to='/'></Redirect>}
          <header className="App-header">
          <nav className="navbar navbar-light bg-light">
            <Link to={'/'} style={{fontSize: 30, flex: 1, color:"black"}} >
            <FaHome style={{fontSize: 35, marginRight: 10}} /> <b>Funny Movies</b> 
            </Link>
            <p style={{fontSize:20, margin: 20}}>Welcome {user}</p>
            <button 
                type="button" 
                className="btn btn-primary" 
                style={{margin: 20}}
                onClick={()=>this.sendLogout()}
            >
                Logout
            </button>
          </nav>
          </header>
          <div className="container">
            <div className="row" style={{marginTop:100}}>
              <div className="col-md-4"/>
              <div className="col-md-6" style={{justifyItems: "center"}}>
                <div className="card">
                    <div className="card-body">
                        <p>Share a Youtube movie.</p>
                        <div className="row">
                            <div className="col-md-3" style={{margin:10}}>
                                Youtube URL :
                            </div>
                            <div className="col-md-4" style={{margin:10}}>   
                                <input 
                                    type="text" 
                                    placeholder="URL" 
                                    name="url"
                                    value={this.state.url}
                                    onChange={this.handleChange}
                                />
                            </div>    
                        </div>
                        <div className="text-center">
                            <button 
                                type="button" 
                                className="btn btn-primary mx-auto"
                                onClick={()=>this.newMovie()}
                            > 
                                Share
                            </button>
                        </div>
                    </div>
                </div>
              </div>
              <div className="col-md-4 "/>
            </div>
          </div>
        </div>
      );
  }
}

export default Share;
