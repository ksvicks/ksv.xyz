import React, { Component } from 'react';
import ReactEmbedGist from 'react-embed-gist';


export class Blog extends Component {
    render() {
        return (
            <div>
                <h2 className='colorWhite'>Blog Subject</h2>
                {/* addsvg */}
                
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <p className="placeholder-glow">
  <span className="placeholder col-12"></span>
</p>

<p className="placeholder-wave">
  <span className   ="placeholder col-12"></span>
</p>
<ReactEmbedGist gist="msaracevic/5d757e2fc72482a9a4a439969500c2eb"
                wrapperClass="gist__bash"
                loadingClass="loading__screen"
                titleClass="gist__title"
                file=".bash_profile.sh"/>
            </div>
        );

        // https://stackoverflow.com/questions/57484257/how-can-i-embed-a-github-gist-inside-of-a-react-component
    }
}

