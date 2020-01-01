import React from 'react';
import { FaHome } from "react-icons/fa";
import {AiOutlineLike, AiOutlineDislike} from "react-icons/ai"
import YouTube from 'react-youtube';
import {Link} from 'react-router-dom'
import axios from 'axios'

const API_URL = "http://18.233.99.1:3100"
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          email: '',
          password: '',
          isLogin: '0',
          movies: [],
          youtube_data: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
    }

    async sendlike(status, id){
        try{
            const response = await axios({
                method: 'put',
                url: API_URL+'/movie',
                data:{
                    movie_id: id,
                    data: status
                }
              });
              this.movieList()
        }catch(error){
            console.error(error);
            
        }
    }

    async componentDidMount(){
        this.movieList()
        let login = localStorage.getItem('Login');
        
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
              await this.setState({
                  movies: response.data.result.movies
              })
        }catch(error){
            console.error(error);
            
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
            this.setState({
              isLogin: '0'
            })
          }
      }

    _onReady(event) {
        event.target.pauseVideo();
      }

      render (){
        const opts = {
            height: '320',
            width: '480',
            playerVars: { 
            autoplay: 0
            }
        };
        
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
                                    videoId={movie.link}
                                    opts={opts}
                                    onReady={this._onReady}
                                />
                                </div>
                                <div className="col-md-4" style={{position:"absolute", marginLeft: 500}}>
                                    <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text" style={{height:400}}>
                                        Shared by: {movie.email}
                                        <br/> 
                                        <span style={{fontSize:16}}>{movie.likes}</span> 
                                        <button 
                                            onClick={() => {this.sendlike("likes", movie.id)}}
                                            style={{marginLeft:5}}
                                        >
                                                <AiOutlineLike style={{fontSize:25}}/>
                                        </button>
                                        <span style={{fontSize:16, marginLeft:20}}>{movie.unlikes}</span> 
                                        <button 
                                            onClick={() => {this.sendlike("unlikes", movie.id)}}
                                            style={{marginLeft:5}}
                                        >
                                            <AiOutlineDislike style={{fontSize:25}}/>
                                        </button>
                                        <br/><b>Description:</b>
                                        <br/>{movie.description}</p>
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
