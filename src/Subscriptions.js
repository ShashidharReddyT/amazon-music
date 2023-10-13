import React from 'react';
import './Subscriptions.css';

function Subscriptions() {

    return (
        <div>
            <div className="subscriptions">
                <div className='headings'>

                    <p className='amazon' >Amazon music pricing</p>
                    <p className='unlimited'> UNLIMITED</p>
                    <br />
                </div>

                <div className="pricing">
                    <div className="pricing-box">
                        <h2 className='line1'>Individual</h2>
                        <p className='line2'>non-Prime members</p>
                        <p className='line3'>$9.99</p>
                        <p className='line4'>per month</p>
                    </div>
                    <div className="pricing-box">
                        <h2 className='line1'>Individual</h2>
                        <p className='line2'>Prime members</p>
                        <p className='line3'>$7.99</p>
                        <p className='line4'>per month</p>
                    </div>
                    <div className="pricing-box">
                        <h2 className='line1'>Family</h2>
                        <p className="line2">Prime members</p>
                        <p className='line3'>$14.99</p>
                        <p className='line4'>per month</p>
                    </div>
                    <div className="pricing-box">
                        <h2 className='line1'>Students</h2>
                        <p className='line2'> {'\u00A0'}</p>
                        <p className='line3'>$4.99</p>
                        <p className='line4'>per month</p>
                    </div>
                </div>
            </div>
            <div className="moreabout">
                <p className='moreabout1'>MORE ABOUT PRIME MUSIC</p>

                <div className='moreabout2'>
                    <div className='l1'>
                        <p>100 million</p>
                        <p> songs</p>
                    </div>
                    <div className='l2'>
                        <p >Ad-free </p>
                        <p>music</p>
                    </div>
                    <div className='l3'>
                        <p>Unlimited offline</p>
                        <p> songs</p>
                    </div>
                    <div className='l4'>
                        <p>Hands-free</p>
                        <p> with Alexa</p>
                    </div>
                    <div className='l5'>
                        <p>Follow your</p>
                        <p> favorite podcasts</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Subscriptions;
