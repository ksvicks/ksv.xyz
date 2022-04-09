import React, { Component } from 'react';
import { ResumeAbout } from './ResumeAbout';
import { ResumeEducation } from './ResumeEducation';
import { ResumeExperience } from './ResumeExperience';
import { ResumeHeader } from './ResumeHeader';
import { ResumeSkills } from './ResumeSkills';

export class Resume extends Component {
    render() {
        return (
            <div className="container border border-secondary pt-3 ps-3">
                <div className="border-bottom border-secondary p-3">
                <ResumeHeader />
                </div>
                <div className="p-3">
                <ResumeAbout />
                <ResumeSkills />
                <ResumeExperience />
                <ResumeEducation/>
                </div>
                
            </div>
        );
    }
}

