import React, { Component } from 'react'

import settingsIcon from "../images/Icons/Settings.svg"
import searchIcon from "../images/Icons/Search.svg"
import archiveIcon from "../images/Icons/Archive.svg"
import "./ProjectTitleBar.css"

import "./UserIcon.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

class ProjectTitleBar extends Component {

    constructor() {
        super()
    
        this.state = {
            open: false
        }
    }

    onOpenModal = () => {
        this.setState({ open: true });
      };
  
      onCloseModal = () => {
        this.setState({ open: false });
      };



    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

   renderSwatch = (color) => {
        return <div className="colorSwatchSelector" key={color} style={{backgroundColor: color, borderWidth: '2px', borderStyle: 'solid'}}></div>
    }


    render = () => {
        //let color = "#3CB4CB";
        let color = this.props.projectColor;
        let colors = ['#E74C3C', '#E67E22', '#F1C40F', '#E91E63', '#9B59B6', '#3498DB', '#2ECB71', '#18AE90']
        const { open } = this.state;

        return (
            <div id="projectTitleContainer" style={{backgroundColor: color}}>
                <h1 id="projectTitle">{this.props.title}</h1>
                <div id="projectTitleLeftContents">
                    {/*<button onClick={this.props.toggleShowArchive}>{this.props.getButtonText()}</button>*/}
                  
                   <img alt={"Settings"} src={settingsIcon} title={"Settings"} onClick={this.onOpenModal} id="projectSettingsIcon"/>
                   <Modal open={open} onClose={this.onCloseModal} little>
                   <input type="text" placeholder="Enter Project Name" className="createProjectInput" />

                <div id="colorPicker">
                    <h4>Project Color:</h4>
                    {/* BEN THIS IS WHERE THE COLORS WILL GO, MY DUDE*/}
                    {colors.map((color) => {
                        return this.renderSwatch(color)
                    })}
                </div>
                    </Modal>
                  
                   <img alt={"Search"} src={searchIcon} title={"Search"} style={{right: '55px'}} id="projectSettingsIcon"/>
                   <img alt={"Archive"} src={archiveIcon} title={this.props.getButtonText()} style={{right: '100px'}} onClick={this.props.toggleShowArchive} id="projectSettingsIcon" />
               </div>
            </div>
        )
    }

}

export default ProjectTitleBar;
