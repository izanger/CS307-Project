import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'
import { Route, Switch, Redirect } from "react-router-dom";
import tempPic from "../images/temp.jpg"
import Task from "./Task.js"
import ProjectTitleBar from "./ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectCollaboratorsBar.js"
import "./ProjectDashboard.css"
import NewProjectButton from "../ProjectSelectorComps/NewProjectButton.js"
import CreateTaskForm from '../CreateTaskForm.js';
import App from '../App';


class ProjectDashboard extends Component {

    constructor() {
        super()
        this.state = {
            projectSynced: false,
            showArchive: false,
            project: {

            }
        }
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

    componentDidMount = () => {
        const newState = { ...this.state }
        rebase.fetch(`projects/${this.props.match.params.id}`, {
            context: this,
            then: (data) => {
                newState.project = data
            }
        }).then(() => {
            this.bindingref = rebase.syncState(`projects/${this.props.match.params.id}`, {
                context: this,
                state: 'project',
                then: () => {
                  newState.projectSynced = true
                  this.setState(newState)
                }
            })
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const nextId = nextProps.match.params.id
        this.setState({projectSynced: false})
        if (nextId !== this.props.match.params.id) {
            this.setState({projectSynced: false})
            if (this.bindingref) {
                rebase.removeBinding(this.bindingref)
            }
            const newState = { ...this.state }
            rebase.fetch(`projects/${nextId}`, {
                context: this,
                then: (data) => {
                    newState.project = data
                }
            }).then(() => {
                this.bindingref = rebase.syncState(`projects/${nextId}`, {
                    context: this,
                    state: 'project',
                    then: () => {
                        newState.projectSynced = true
                        this.setState(newState)
                    }
                })
            })
        }
        this.setState({projectSynced: true})
    }

    componentWillUnmount = () => {
        this.setState({
            projectSynced: false
        })
    }

    toggleShowArchive = () => {
        if(this.state.showArchive){
            this.setState({showArchive: false})
        } else {
            this.setState({showArchive: true})
        }
        
    }
    // setProjectDashboardState = () =>{

    //     const newState = { ...this.state }
    //     rebase.fetch(`projects/${this.props.match.params.id}`, {
    //         context: this,
    //         then: (data) => {
    //             newState.project = data
    //         }
    //     }).then(() => {
    //         this.bindingref = rebase.syncState(`projects/${this.props.match.params.id}`, {
    //             context: this,
    //             state: 'project',
    //             then: () => {
    //               newState.projectSynced = true
    //               this.setState(newState)
    //             }
    //         })
    //     })

    // }

    render = () => {

        let finalRender

        if (this.state.projectSynced) {

            let color = "#3CB4CB";
            // let taskKeys = Object.keys(this.state.project.taskList)

            let tasks
            if (this.state.project.taskList) {
                if(!this.state.showArchive){
                    const taskKeys = Object.keys(this.state.project.taskList)
                    tasks = (
                        taskKeys.map((key) => {
                            return <Task archived={false} projectID = {this.props.getAppState().currentProject.key} taskKey={key} deleteTaskMethod={this.setProjectDashboardState} key={key} task={this.state.project.taskList[key]}/>
                        })
                    )
                } else {
                    const taskKeys = Object.keys(this.state.project.archivedTaskList)
                    tasks = (
                        taskKeys.map((key) => {
                           return <Task archived={true} projectID = {this.props.getAppState().currentProject.key} taskKey={key} deleteTaskMethod={this.setProjectDashboardState} key={key} task={this.state.project.archivedTaskList[key]}/>
                        })
                    )
                }
            }

            finalRender = (
                <div id="taskDashboard">
                    <ProjectTitleBar title={this.state.project.projectName} />
                    {/* <div id="taskDashContainer">
                    </div> */}
                    <ProjectCollaboratorsBar users={this.state.project.userList} />
                    <svg height="13" width="100%">
                        <line x1="12" y1="12" x2="98.5%" y2="12" className="projectDivider" style={{stroke:'#C6C6C6',strokeWidth:'1'}} />
                    </svg>
                    <button onClick={this.toggleShowArchive}>Toggle Archive</button>

                    {tasks}

                    <div><NewProjectButton onClick={() => {
                        this.props.goToUrl("/createtask");
                    }}/></div>

                </div>
            )
        } else {
            finalRender = (
                <div></div>
            )
        }

        return (
            <div id="taskDashboard">{finalRender}</div>
        )
    }

}

export default ProjectDashboard;
