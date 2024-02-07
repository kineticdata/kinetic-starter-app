import React from "react";
import '../assets/styles/opportunities.css';

export const Opportunities = () => {
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
                            <div className="opportunity-item-double">
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
                                    <li>
                                        UDRA RFI Documentation 
                                    </li>
                                    <li>
                                        UDRA 1.0 Release (coming soon!) 
                                    </li>
                                    <li>
                                        UDRI Public APIs Documentation  
                                    </li>
                                    <li>
                                        Sample Backend Connector for Data Catalog  
                                    </li>
                                    <li>
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
                        <div className="opportunity-item-double">
                            <div className="card-yellow">

                            </div>
                            <div className="card-grey">
                                
                            </div>
                        </div>
                        <div className="opportunity-item-double">
                            <div className="card-grey">

                            </div>
                            <div className="card-yellow">
                                
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
        </>
    )
}