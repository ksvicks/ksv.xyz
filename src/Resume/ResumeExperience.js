import React, { Component } from 'react';

export class ResumeExperience extends Component {
    render() {
        return (
            <div>
                <h3>Experience</h3>
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">Zoho Corportation, Member Technical Staff</h5>
                            <small>2017-Present</small>
                        </div>
                        <p class="mb-1">Some placeholder content in a paragraph.</p>
                        <small>And some small print.</small>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Developed multiple Rest APIs to support various clients. This helps clients to easily develop web applications powered by Rest APIs.</li>
                            <li class="list-group-item">Migrated a service to another service. This enables user to have addtional features of service</li>
                        </ul>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">Tata Consultancy Services, Assistant System Engineer</h5>
                            <small class="text-muted">2015-2017</small>
                        </div>
                        <p class="mb-1">Some placeholder content in a paragraph.</p>
                        <small class="text-muted">And some muted small print.</small>
                    </a>
                </div>
            </div>
        );
    }
}