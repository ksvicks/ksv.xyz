import React, { Component } from 'react';  
import {Nav} from './Nav'
import {About} from './About'
import {Shop} from './Shop'
import {Home} from './Home'
import {BrowserRouter as Router, Switch, Route, Routes}from 'react-router-dom'
import { AuthorCard } from './Home/AuthorCard';
import { List } from './Blog/List';
import { Blog } from './Blog/Blog';
import { PersonalSpace } from './Personal/PersonalSpace';

export class App extends Component{  
  render(){  
  return (
    <Router>
    <div className="App">
    <Nav/>
    <div className="container-fluid p-0">
    <Routes>
    <Route path="/" element={<AuthorCard/>}/>
    <Route path="/blogs" element={<List/>}/>
    <Route path="/shop" element={<Shop/>}/>
    <Route path="/blog" element={<Blog/>}/>
    <Route path="/space" element={<PersonalSpace/>}/>
    </Routes>
    </div>
    </div>
    </Router>
  );
}
}

