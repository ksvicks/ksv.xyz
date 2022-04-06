import './css/Nav.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Nav extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light  navFont serifFont">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">ksv.xyz</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse ms-auto" id="navbarScroll">
                <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll">
                  <li className="nav-item active">
                      <Link to="/" className="nav-link active">Home</Link>
                  </li>
                  <li className="nav-item">
                     <Link to="/blogs" className="nav-link active">Resume</Link> 
                  </li>
                  <li className="nav-item">
                     <Link to="/blogs" className="nav-link active">Tech Blogs</Link> 
                  </li>
                  <li className="nav-item">
                     <Link to="/space" className="nav-link active">Personal Space</Link> 
                  </li>
                  <li className="nav-item">
                     <Link to="/space" className="nav-link active">Contact Me</Link> 
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        );
    }
}

