import React, { Component } from "react"
import rebase from "./rebase";
import InviteList from "./InviteList"
import { emailRegistered, validateEmail, buildUserFromGoogle } from "./apphelpers.js"

import "./CreateProjectForm.css"

class CreateProjectForm extends Component {

    // Default constructor instantiates state
    constructor() {
        super()
        this.state = {
            titleValue: "",
            inviteValue: "",
            errorValue: "",
            userList: [ ]
        }
    }

    // Method for changing title value in state
    changeTitleValue = (event) => {
        const newState = { ...this.state }
        newState.titleValue = event.target.value
        this.setState(newState)
    }

    // Method for changins invite value in state
    changeInviteValue = (event) => {
        const newState = { ...this.state }
        newState.inviteValue = event.target.value;
        this.setState(newState)
    }

    // Check to see if user has pressed enter key
    enterInviteValue = (event) => {
        if (event.keyCode == 13) {
            this.inviteUser()
        }
    }

    // Checks to see is this.state.emailValue is valid
    emailValidationProcess = () => {
        if (this.state.inviteValue === "") {
            return false
        }

        const newState = { ...this.state }
        if (!validateEmail(this.state.inviteValue)) {
            newState.errorValue = "Please enter a valid email address..."
            this.setState(newState)
            return false
        }

        const promise = emailRegistered(this.state.inviteValue)
        promise.then((data) => {
            if (!data.val()) {
                newState.errorValue = "That email address has not been registered with Amora..."
                this.setState(newState)
                return false
            }
            if (this.state.userList.includes(this.state.inviteValue)) {
                newState.errorValue = "You've already added that user to this project..."
                this.setState(newState)
                return false
            }
            newState.errorValue = ""
            newState.inviteValue = "";
            newState.userList.push(this.state.inviteValue)
            this.setState(newState)
            return true
        })
        // TODO: 
        // MAKE USER LIST HOLD USER OBJECTS
        // MAKE IT SO USERS GET AN INVITE IN DATABASE
        // WORK ON SYCINGSTATE WITH USERS SO THEIR INVITES WILL BE UPDATED ON THEIR CLIENTS AUTOMATICALLY
        // MAKE INVITE PAGE / ACCEPTING INVTITE LOGIC
    }

    // Checks to see if project is valid or not
    isProjectValid = () => {
        const newState = { ...this.state }
        if (this.state.titleValue === "") {
            newState.errorValue = "Please enter a project title..."
            this.setState(newState)
            return false
        } 
        return true
    }

    // Let Firebase create a ProjectID and add all the relevant from the form
    createProject = () => {
        if (!this.isProjectValid()) {
            return
        }
        const ref = rebase.push("projects", {
            data: {
                projectName: this.state.titleValue, 
                projectColor: "black", 
                projectCreator: this.props.getAppState().user.uid
            }
        }).then((newLocation) => {
            rebase.update(`projects/${newLocation.key}`, {
                data: {
                    key: newLocation.key
                }
            })
        })

        for (let i = 0; i < this.state.userList.length; i++) {
            
        }

    }

    // Mandatory render method
    render = () => {
        return (
            <div id="taskDashboard">
                <i className="material-icons createProjectButton" onClick={() => {
                    this.props.goToUrl("dashboard")
                }}>backspace</i>
                <input type="text" placeholder="Project title" className="createProjectInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />
                <input type="text" placeholder="Email of person you'd like to invite" className="createProjectInput"
                value={this.state.inviteValue} onChange={this.changeInviteValue} onKeyDown={this.enterInviteValue} />
                <p className="errorBox">{this.state.errorValue}</p>
                <button className="createProjectInput" onClick={this.emailValidationProcess}>Invite user</button>
                <InviteList users={this.state.userList} />
                <button className="createProjectInput" onClick={this.createProject}>Create project</button>
            </div>
        )
    }
}

export default CreateProjectForm;