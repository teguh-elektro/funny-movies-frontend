import React from 'react';
import { FaHome } from "react-icons/fa";
import {AiOutlineLike, AiOutlineDislike} from "react-icons/ai"
import YouTube from 'react-youtube';
import {Link} from 'react-router-dom'
import axios from 'axios'
import queryString from 'query-string'

const API_URL = "http://localhost:3000"
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          email: '',
          password: '',
          isLogin: '0',
          movies: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
    }

    componentDidMount(){
        this.movieList()
        let login = localStorage.getItem('Login');
        console.log(login);
        
        if(login == '1'){
            this.setState({
                isLogin: '1'
            });
        }else{
            this.setState({
                isLogin: '0'
            });
        }
      }
    
    async movieList(){
        try{
            const response = await axios({
                method: 'get',
                url: API_URL+'/movie'
              });
              console.log(response.data.result.movies);
              this.setState({
                  movies: response.data.result.movies
              })
        }catch(error){
            console.log(error);
            
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
        }catch(error){

        }
    }

    async sendLogin() {
        try{
          const response = await axios({
            method: 'put',
            url: API_URL+'/user',
            data: {
              email: this.state.email,
              password: this.state.password
            }
          });
          console.log(response.data.result.data[0]);
          let data = response.data.result.data[0]
          const {
              id,
              email,
              status
          } = data;
          localStorage.setItem("id", id);
          localStorage.setItem("email", email);
          localStorage.setItem("Login", '1');
          this.setState({
            isLogin: '1'
          })
          }catch(error) {
            console.log(error);
            this.setState({
              isLogin: '0'
            })
          }
      }

    async getDataYoutube(id){
        try{
            const parsed = queryString.parse(id);
            console.log(parsed);
            const response = await axios({
                method: 'get',
                url: 'https://www.googleapis.com/youtube/v3/videos',
                params: {
                  part: "snippet",
                  key: 'AIzaSyApCy9eVPhWHQC_32uJDRX-tbwCSlHjWys',
                  id: parsed
                }
            });
            const data = response.data.items[0];
            console.log(data.snippet.localized.title);
            return(data.snippet.localized)
        }catch(error){
            console.log(error);
        }
    }

    _onReady(event) {
        event.target.pauseVideo();
      }

    render(){
        const opts = {
            height: '320',
            width: '480',
            playerVars: { 
            autoplay: 0
            }
        };
        this.getDataYoutube("2g811Eo7K8U")
        const user = localStorage.getItem('email');
        return (
            <div>
            { 
                (this.state.isLogin == '1') ?
                    <header className="App-header">
                    <nav className="navbar navbar-light bg-light">
                        <a className="navbar-brand d-flex" style={{fontSize: 30, flex: 1}} href="#">
                        <FaHome style={{fontSize: 35, marginRight: 10}} /> <b>Funny Movies</b> 
                        </a>
                        <p style={{fontSize:20, margin: 20}}>Welcome {user}</p>
                        <Link to={'/share'}>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                style={{margin:20}}
                            >
                                    Share a Movie
                            </button>
                        </Link>
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={() => this.sendLogout()}
                        >
                            Logout
                        </button>
                    </nav>
                    </header>
                    :
                    <header className="App-header">
                    <nav className="navbar navbar-light bg-light">
                        <Link to={'/'} className="navbar-brand d-flex" style={{fontSize: 30, flex: 1}} >
                        <FaHome style={{fontSize: 35, marginRight: 10}} /> <b>Funny Movies</b> 
                        </Link>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            style={{margin:20, padding:8}}
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            style={{margin:20, padding:8}}
                        />
                        <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={() => this.sendLogin()}
                        >
                            Login / Register
                        </button>
                    </nav>
                    </header>
            }
            <div className="container mb-10">
               {
                    this.state.movies.map((movie) => {
                        return(
                            <div className="card" style={{margin:5}}>
                                <div className="row no-gutters">
                                <div className="col-md-4 ml-3 mt-1" style={{width: 490}}>
                                <YouTube
                                    videoId="2g811Eo7K8U"
                                    opts={opts}
                                    onReady={this._onReady}
                                />
                                </div>
                                <div className="col-md-4" style={{position:"absolute", marginLeft: 500}}>
                                    <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">
                                        Shared by: someone@gmail.com
                                        <br/> 
                                        <span style={{fontSize:16}}>{movie.likes}</span> <AiOutlineDislike style={{fontSize:25}}/>
                                        <span style={{fontSize:16, marginLeft:20}}>{movie.unlikes}</span> <AiOutlineLike style={{fontSize:25}}/>
                                        <br/><b>Description:</b>
                                        <br/>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                    </div>
                                </div>
                                </div>
                            </div>            
                        )
                    }
                )}
            </div>
            </div>
        );
  }
  
}

export default Home;
