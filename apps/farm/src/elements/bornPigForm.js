import React from 'react';
import PigSelector from "./pigSelector";
import MeatchainService from "../services/meatchain";
import CageSelector from "./cageSelector";
import PrintableQrs from "./printableQrs";
import Toast from "../utils/toast";
import ReactToPrint from "react-to-print";

export default class BornPigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isCreating: false,
        parentId: "",
        piglets: null,
        breed: "",
        birthdate: "",
        location: "",
        createdPigs: []
    }
    this.parentUpdate = this.parentUpdate.bind(this);
    this.updateCage = this.updateCage.bind(this);
  }

  submitForm = async() => {
      let {parentId, piglets, breed, birthdate, location} = this.state;
      this.setState({isCreating: true});
      let meatchain = new MeatchainService();
      let newPigs = [];
      for(let i = 1; i <= piglets; i++) {
          Toast.info("Creating pig " + i);
          const response = await meatchain.createPig(parentId, birthdate, breed, location);
          newPigs.push(response.data);
      }
      newPigs.forEach(pig => {
          this.setState({
             createdPigs: this.state.createdPigs.push(pig)
          });
      });
      Toast.success("Piglets created");
      this.setState({isCreating: false});
  }

  parentUpdate(value) {
      this.setState({
          parentId: value
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
  updatePiglets(event) {
      this.setState({
          piglets: event.target.value
      });
  }
    updateCage(value) {
        this.setState({
            location: value
        });
    }

    render() {
      let {isCreating} = this.state;
      let buttonText = "Register new piglets";
      let disabled = false;
      if(isCreating) {
          disabled = true;
          buttonText = "Creating...";
      }
      let componentRef = React.createRef();
      let piglets = this.state.piglets;
      if(piglets == null) piglets = 0;
      if(this.state.piglets == null || this.state.parentId === "" || this.state.breed === "" || this.state.birthdate === "" || this.state.location === "") {
          disabled = true;
          buttonText = "Fill all the fields to continue";
      }
      let printDisable = true;
      if(!isCreating && this.state.createdPigs.length > 0) {
          printDisable = false;
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
                <div className="form-group">
                    <label htmlFor="data">Piglet amount</label>
                    <input type="number" className="form-control" id="data" value={piglets} onChange={(e) => this.updatePiglets(e)}/>
                </div>
                <div className="form-group row">
                    <label className="col-md-4 col-form-label">Parent</label>
                    <PigSelector parentCallback={this.parentUpdate}/>
                </div>
                <div className="form-group row">
                    <label htmlFor="parent" className="col-md-4 col-form-label">Location</label>
                    <CageSelector selected={this.state.location} parentCallback={this.updateCage} />
                </div>
                <div className="form-group ">
                    <button type="button"
                            className="btn btn-primary waves-effect waves-light"
                            disabled={disabled}
                            onClick={() => this.submitForm()}
                    >{buttonText}</button>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-12">
                        <ReactToPrint
                            trigger={() => <button type="button"
                                                   className="btn btn-primary waves-effect waves-light"
                                                   disabled={printDisable}
                            >Print created piglets</button>}
                            content={() => componentRef}
                        />
                        <div style={{display: "none"}}>
                            <PrintableQrs items={this.state.createdPigs} isCreating={isCreating} ref={(el) => (componentRef = el)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}