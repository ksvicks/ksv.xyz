import React, { Component } from 'react';

export class ResumeHeader extends Component {
    render() {
        return (
            <div>
                <h3>Vignesh Karuppiah Singaraj</h3>
                <div><i class="bi bi-envelope" /> <a href="mailto:test@gmail.com" class="link-dark" target="_blank">test@gmail.com</a></div>
                <div><i class="bi bi-linkedin" /> <a href="https://www.linkedin.com/in/vigneshksingaraj" class="link-dark" target="_blank">www.linkedin.com/in/vigneshksingaraj</a></div>
                <div><i class="bi bi-github" />  <a href="https://www.github.com/ksvicks" class="link-dark" target="_blank"> www.github.com/ksvicks </a></div>
                <div><i class="bi bi-globe" /> <a href="https://www.ksv.xyz" class="link-dark" target="_blank"> www.ksv.xyz</a></div>
            </div>
        );
    }
}

