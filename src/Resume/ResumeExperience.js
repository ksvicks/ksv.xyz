import React, { Component } from 'react';

export class ResumeExperience extends Component {
    render() {
        return (
            <div>
                <h4><u>Experience</u></h4>
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">Zoho Corportation</h5>
                            <small>2017-Present</small>
                        </div>
                        <small>Member Technical Staff</small>
                        <ul class="list-group list-group-flush fw-light">
                            <li class="list-group-item bgTransparent">Build high functioning, scalable web applications using Java, MySQL, Kafka, Redis and HBase</li>
                            <li class="list-group-item bgTransparent">Developed multiple Rest APIs to support various clients.</li>
                            <li class="list-group-item bgTransparent">Migrated a service to another service. This enables user to have addtional features of service</li>
                        </ul>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">Tata Consultancy Services</h5>
                            <small>2015-2017</small>
                        </div>
                        <small>Assistant System Engineer</small>
                        <ul class="list-group list-group-flush fw-light">
                            <li class="list-group-item bgTransparent">Enhanced features in a web application for a major American Health Insurance Company </li>
                            <li class="list-group-item bgTransparent">Maintained multiple services and provided support.</li>
                        </ul>
                    </a>
                </div>
            </div>
        );
    }
}