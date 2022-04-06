import React, { Component } from 'react';

export class AuthorCard extends Component {
    render() {
        return (
                <div class="row">
                    <div class="col-lg-12"> 
                        <div className="card mb-3">
                            <div className="card-body serifFont">
                            <h1 class="display-3">Vignesh KS</h1>
                            <br/>
                                <p className="lead">Hello, world!</p>
                                <p>I am a <mark>Software Developer</mark>. 
                                
                                This is my blog space and also a resume. </p>
                                
                                <a href="#" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

