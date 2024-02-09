import React, { useState, useEffect, forceUpdate } from "react";
import '../assets/styles/opportunities.css';
import { searchSubmissions, updateSubmission, defineKqlQuery } from '@kineticdata/react';
import { Markdown } from '../widgets/markdown';

export const Opportunities = ({ loggedIn }) => {
    const [submission, setSubmission] = useState(null);
    const [editing, setEditing] = useState(0);
    const [newMarkdown, setNewMarkdown] = useState('');
 
    const updateMarkdown = () => {
        setEditing(2);
        const id = submission.id || null;
        const values = {
            'Markdown Field': newMarkdown
        };

        if (id) {
            updateSubmission({ id, values })
                .then(({ submission }) => {
                    setEditing(0);
                }
            );
        }
    }

    useEffect(() => {
        if (editing === 0) {
            const query = defineKqlQuery()
            .equals('type', 'type')
            .end();
            searchSubmissions({
            kapp: 'services',
            form: 'technical-details',
            search: {
                q: query({ type: 'Content'}),
                include: ['details', 'values'],
                },
            public: true,
            }).then(({ submissions }) => {
                setSubmission(submissions[0]);
            });
        }
    }, [editing])

    return (
        <>
            <div className="page-header">
                <span className="page-header-title">
                    OPPORTUNITIES
                </span>
            </div>
            <div className="content-wrapper">
                <div className="centered-column">
                    <div className="content-container">
                        <div className="content-title">
                            <strong>
                                IEx Experimentation Offerings
                            </strong>
                        </div>
                        <div className="content-title-underline" />
                        <div className="content-title">
                            <strong>
                                UDRA
                            </strong>
                        </div>
                        <div className="content-title-underline" />
                        <span className="content-subtitle">
                            Unified Data Reference Architecture
                        </span>
                        <div className="opportunities-container">
                            <div className="opportunity-item">
                                <div className="opportunity-title-med">
                                    <strong>
                                        Unified Data Reference Architecture (UDRA) Experimentation:
                                    </strong>
                                </div>
                                <p className="opportunity-text">
                                    As part of our initial offering within the Innovation Exchange Lab, we are collaborating with the UDRA team and industry partners to build and test the UDRA implementation
                                    guidelines. While this is initially a closed test, we are looking for your level of interest on testing your solutions against the UDRA guidelines in the near future. As we refine our lab
                                    experience and our UDRA offering, we will keep you looped in on how you can stay up to date and get involved over time. 
                                </p>
                                <button className="opportunity-signup-btn">
                                    Sign Up Here
                                </button>
                            </div>
                            <div className="opportunity-item">
                                <div className="opportunity-title-med">
                                    <strong>
                                        Unified Data Reference Architecture (UDRA) – What is it?
                                    </strong>
                                </div>
                                <p className="opportunity-text">
                                    The Assistant Secretary of the Army for Acquisition, Logistics, and Technology (ASA-ALT) Deputy Assistant Secretary of the Army (DASA) for Data, Engineering, and Software
                                    (DES) is defining a Unified Data Reference Architecture that introduces Data Mesh principles into the Army’s data architecture. Data Mesh is a data architecture based on a
                                    federated and decentralized approach to analytical data production, sharing, access, and management in complex and large-scale environments, within or across organizations.  It
                                    is characterized by federated computational governance, self-service infrastructure, treating and providing data as a product, and autonomous data domains that are responsible
                                    for their data. The Unified Data Reference Architecture (UDRA) is intended to guide the implementation of interoperable data sharing across all Army acquisition programs.  
                                </p>
                            </div>
                            <div className="opportunity-card-row">
                                <div className="opportunity-item">
                                    <div className="opportunity-title-sm">
                                        <strong>
                                            In Development: Our UDRA Reference Implementation
                                        </strong>
                                    </div>
                                    <p className="opportunity-text">
                                        Currently in active development and continuous iteration, our reference
                                        implementation represents the cornerstone of our initial experimentation offering. A
                                        reference implementation of UDRA serves as a practical technical blueprint.
                                        Demonstrates real-world application of the UDRA framework, allowing for early
                                        experimentation and validation against the provided services and components allowing
                                        vendors to demonstrate conformance and/or capture lessons learned to inform
                                        improved product development. 
                                    </p>
                                </div>
                                <div className="opportunity-item-right">
                                    <div className="opportunity-title-sm">
                                        <strong>
                                            What is within the first phase of the UDRA Experimentation? 
                                        </strong>
                                    </div>
                                    <p className="opportunity-text">
                                        The initial phase of this offering will provide limited services as part of the reference
                                        implementation, and experimentation will address targeted priority use cases and
                                        solutions against the state of maturity of the implementation. As our reference
                                        implementation expands and matures, more opportunities to expand on scope of
                                        solutions and capabilities for experimentation and demonstration will be iteratively
                                        released and announced.  
                                    </p>
                                </div>
                            </div>
                            <div className="opportunity-item">
                                <div className="opportunity-title-med">
                                    <strong>
                                        Currently seeking these Solutions for Specific Use Cases/Services:
                                    </strong>
                                </div>
                                <p className="opportunity-text">
                                    We are actively seeking vendors and software solutions that adhere to the principles of our data mesh reference architecture. We are particularly interested in solutions serving as 
                                    data catalogs within the framework of UDRA. If your offering aligns with our vision and UDRA service descriptions of a data catalog capability, we invite you register to the Army
                                    Innovation Exchange and submit a UDRI Test Request. 
                                </p>
                                <p className="opportunity-text">
                                    To learn more about UDRA and better establish feasibility and approach of your solutions integration into our IEx platform, we recommend you review the following resources: 
                                </p>
                                <ul className="opportunity-text">
                                    <li className="list-item">
                                        UDRA RFI Documentation 
                                    </li>
                                    <li className="list-item">
                                        UDRA 1.0 Release (coming soon!) 
                                    </li>
                                    <li className="list-item">
                                        UDRI Public APIs Documentation  
                                    </li>
                                    <li className="list-item">
                                        Sample Backend Connector for Data Catalog  
                                    </li>
                                    <li className="list-item">
                                        IEx Infrastructure & Entrance Criteria 
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="content-title">
                            <strong>
                                How it Works:
                            </strong>
                        </div>
                        <div className="opportunity-card-row">
                            <div className="opportunity-card card-yellow">
                                <div className="card-title">
                                    Step 1
                                </div>
                                <div className="card-subtitle">
                                    Company and Software Registration:
                                </div>
                                <ul className="card-list">
                                    <li className="card-item">Provide your company’s details</li>
                                    <li className="card-item">
                                        Select a specific experimental offering within the IEx to showcase
                                        your solution’s capabilities and adherence to the reference
                                        architecture.
                                    </li>
                                    <li className="card-item">
                                        Submit software specifications and relevant documents pertaining
                                        to your solution.
                                    </li>
                                </ul>
                            </div>
                            <div className="opportunity-card card-blue">
                                <div className="card-title">
                                    Step 2
                                </div>
                                <div className="card-subtitle">
                                    Evaluation, Technical Consultation, and Scheduling:
                                </div>
                                <ul className="card-list">
                                    <li className="card-item">
                                        Experimentation requests will be assessed through a review and
                                        approval process to ensure the solution aligns with the desired
                                        capabilities and service definitions per the reference architecture.
                                    </li>
                                    <li className="card-item">
                                        Approved requests will proceed with addressing technical and
                                        security integration requirements, followed by scheduling the
                                        experimentation phase.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="opportunity-card-row">
                            <div className="opportunity-card card-blue">
                                <div className="card-title">
                                    Step 3
                                </div>
                                <div className="card-subtitle">
                                    Deployment and Integration:
                                </div>
                                <ul className="card-list">
                                    <li className="card-item">
                                        Implement your software solution on the IEx platform.
                                    </li>
                                    <li className="card-item">
                                        Engage in the experimentation phase, integrating your solution
                                        with the reference implementation components and services.
                                    </li>
                                </ul>
                            </div>
                            <div className="opportunity-card card-yellow">
                                <div className="card-title">
                                    Step 4
                                </div>
                                <div className="card-subtitle">
                                    Demonstration and Feedback:
                                </div>
                                <ul className="card-list">
                                    <li className="card-item">
                                        Conduct a culminating technical demonstration for the IEx
                                        government stakeholders, executing pre-defined use cases.
                                    </li>
                                    <li className="card-item">
                                        Document and record the insights and lessons learned during the
                                        process.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <i className="fa-solid fa-exclamation big-icon"/>
                        <div className="content-title">
                            <strong>
                                Important Note
                            </strong>
                        </div>
                        <div className="opportunity-text-centered">
                            Any Personally Identifiable Information (PII) and/or sensitive information submitted during registration will be held as Controlled Unclassified Information (CUI).  You should NOT submit any
                            Classified information or Privately held Intellectual Property or content.  Only provide what is already publicly available.
                        </div>
                    </div>
                </div>
            </div>
            <div className="grey-bg">
                <div className="centered-column">
                    {loggedIn && (
                        <button
                            className="edit-md-btn"
                            onClick={e => {
                                if (editing === 0) {
                                    setEditing(1);
                                } else if (editing === 1) {
                                    updateMarkdown(newMarkdown);
                                }
                            }}
                            disabled={editing === 2 ? true : false}
                        >
                            {editing === 0 ? 'Edit'
                                : editing === 1 ? 'Update'
                                : editing === 2 ? 'Updating...'
                                : null}
                        </button>
                    )}
                    {submission && (
                        <Markdown
                            key={submission.updatedAt}
                            initialValue={submission.values['Markdown Field'] || ''}
                            disabled={editing === 0 ? true : false}
                            updateMarkdown={setNewMarkdown}
                        />
                    )}
                </div>
            </div>
        </>
    )
}