import React from "react";
import CageSelector from "./cageSelector";
import MeatchainService from "../services/meatchain";
import Toast from "../utils/toast";

export default class NewPigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        breed: "",
        birthdate: "",
        location:"",
        parentId: "",
        submitting: false,
        lastCreated: "",
    }
    this.cageUpdate = this.cageUpdate.bind(this);
  }
  cageUpdate(value) {
      this.setState({
          location: value
      });
  }
  updateBirthdate(e) {
      this.setState({
          birthdate: e.target.value
      });
  }
  updateBreed(e) {
      this.setState({
          breed: e.target.value
      });
  }

  submitForm() {
      let { breed, birthdate, location, parentId } = this.state;
      this.setState({
          submitting: true
      });
      let meatchain = new MeatchainService();
      meatchain.createPig(parentId, birthdate, breed, location).then(response => {
          this.setState({
              submitting: false,
              breed: "",
              birthdate: "",
              location:"",
              parentId: "",
              lastCreated: response.data.pig_id
          });
          Toast.success("Pig created successfully, id: "+ response.data.pig_id);
      }).catch(err => {
         Toast.error(err.toString());
          this.setState({
              submitting: false
          });
      });
  }

    render() {
      let createText = "Create new pig";
      let disabled = false;
      if(this.state.birthdate === "" || this.state.breed === "" || this.state.location === "") {
          createText = "Fill all the fields to create a new pig";
          disabled = true;
      }
      if(this.state.submitting) {
          createText = "Creating pig...";
          disabled = true;
      }
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="data">Breed</label>
                    <input type="text" className="form-control" id="data" placeholder="Breed" value={this.state.breed} onChange={(e) => this.updateBreed(e)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="data">Birthdate</label>
                    <input className="form-control" type="date" value={this.state.birthdate}
                           id="example-date-input" onChange={(e) => this.updateBirthdate(e)} />
                </div>
                <div className="form-group row">
                    <label>Location</label>
                    <CageSelector parentCallback={this.cageUpdate}/>
                </div>
                <div className="form-group">
                    <button type="button"
                            className="btn btn-primary waves-effect waves-light"
                            disabled={disabled}
                            onClick={() => this.submitForm()}
                    >{createText}</button>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-12">
                        <strong>Last created pig: {this.state.lastCreated}</strong>
                    </div>
                </div>
            </div>
        );
    }
}