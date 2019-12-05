import React, { PureComponent } from "react";

class Campaign extends PureComponent {
    render() {
        const { name, campaignId } = this.props;

        console.log(name + "rendered");
        return (
            <div className="player">
                <span className="player-name">{name}</span>
                <div className="counter">
                    <span className="counter-score">{campaignId}</span>
                </div>
                />
            </div>
        );
    }
}

export default Campaign;
