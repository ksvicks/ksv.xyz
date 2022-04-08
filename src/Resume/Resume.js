import React, { Component } from 'react';
import { ResumeAbout } from './ResumeAbout';
import { ResumeExperience } from './ResumeExperience';
import { ResumeHeader } from './ResumeHeader';
import { ResumeSkills } from './ResumeSkills';

export class Resume extends Component {
    render() {
        return (
            <div>
                <h1>Resume</h1>
                <ResumeHeader />
                <ResumeAbout />
                <ResumeSkills />
                <ResumeExperience />
            </div>
        );
    }
}

