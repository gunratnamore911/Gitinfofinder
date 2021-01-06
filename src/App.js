import React, { Component, Fragment } from "react";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import "./App.css";
import User from "./components/users/User";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import About from "./components/pages/About";
import Users from "./components/users/Users";
import Alert from "./components/layouts/Alert.js";
import Search from "./components/users/Search.js";
let githubClientId;
let githubClientSecret;
if (process.env.NODE_ENV !== "production") {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}
export class App extends Component {
  state = {
    users: [],
    loading: false,
    alert: null,
    user: {},
    repos: [],
  };

  // static propTypes = {
  //   searchUsers: PropTypes.func.isRequired,
  //   clearUsers: PropTypes.func.isRequired,
  // };
  // async componentDidMount() {
  //   this.setState({ loading: true });
  //   const res = await axios.get(
  //     `https://api.github.com/users?client_id =${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
  //   );
  //   this.setState({ users: res.data, loading: false });
  // }

  clearUsers = () => {
    this.setState({ users: [], loading: false });
  };

  searchUsers = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id =${githubClientId}&client_secret=${githubClientSecret}`
    );
    this.setState({ users: res.data.items, loading: false });
  };

  //getting single user
  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id =${githubClientId}&client_secret=${githubClientSecret}`
    );
    this.setState({ user: res.data, loading: false });
  };
  //get repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id =${githubClientId}&client_secret=${githubClientSecret}`
    );
    this.setState({ repos: res.data, loading: false });
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg: msg, type: type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <div className="gunratna">
                      <strong>Search Any Git user</strong>
                    </div>
                    <Search
                      setAlert={this.setAlert}
                      showClear={this.state.users.length > 0 ? true : false}
                      clearUsers={this.clearUsers}
                      searchUsers={this.searchUsers}
                    />
                    <Users
                      loading={this.state.loading}
                      users={this.state.users}
                    />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About}></Route>
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    user={this.state.user}
                    repos={this.state.repos}
                    loading={this.state.loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
        <Footer />
      </Router>
    );
  }
}

export default App;
