import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            2022 © Meatchain.
                        </div>
                        <div className="col-sm-6">
                            <div className="text-sm-right d-none d-sm-block">
                                Crafted with <i className="mdi mdi-heart text-danger"></i> by Aaron J. Morales Botton
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}