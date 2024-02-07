import React from "react";
import armyStar from '../assets/army_star.png';

export const Footer = () => {

    return (
        <div className="footer-wrapper">
            <div className="footer-content">
                <div className="footer-col-1">
                    <div className="footer-1-row-1">
                        <img src={armyStar} className="header-logo" alt="Kinetic Data logo" />
                        <h1 className="army-tag">U.S. ARMY</h1>
                    </div>
                    <div className="footer-1-row-2">
                        Deputy Assistant Secretary of the Army for Data, Engineering and Software
                    </div>
                    <div className="footer-1-row-3">
                        ATTN: Commander's Action Group<br />
                        6662 Gunner Circle, Building 3071<br />
                        Aberdeen Proving Ground, Maryland 21005
                    </div>
                    <div className="footer-1-row-4">
                        <div className="footer-1-row-4-item">iSALUTE</div>
                        <div className="footer-1-row-4-item">Freedom of Information Act</div>
                        <div className="footer-1-row-4-item">No Fear Act</div>
                        <div className="footer-1-row-4-item">Privacy Policy</div>
                    </div>
                </div>
                <div className="footer-col-2">
                    <div className="col-header">
                        AT THE INNOVATION EXCHANGE
                    </div>
                    <div className="col-item">About</div>
                    <div className="col-item">Priority Research Areas</div>
                    <div className="col-item">Media</div>
                    <div className="col-item">Opportunities</div>
                    <div className="col-item">Contact Us</div>
                    <div className="col-item">Registration</div>
                </div>
                <div className="footer-col-3">
                    <div className="col-header">
                        DEVCOM CENTERS AND LAB
                    </div>
                    <div className="col-item">Armaments Center</div>
                    <div className="col-item">Army Research Laboratory</div>
                    <div className="col-item">Aviation & Missile Center</div>
                    <div className="col-item">C5ISR Center</div>
                    <div className="col-item">Chemical Biological Center</div>
                    <div className="col-item">DEVCOM Analysis Center</div>
                    <div className="col-item">Ground Vehicle System Center</div>
                    <div className="col-item">Soldier Center</div>
                </div>
            </div>
            <div className="copyright">
                Copyright © 2024 All Rights Reserved.
            </div>
        </div>  
    );
}