import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import Table from 'react-bootstrap/lib/Table';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

const API_SERVER = 'http://localhost:3000/';
export default class SearchForm extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {open: false, results: [], content: []};
  }

  closeModal() {
    this.setState({open: false})
  }

  openModal(id) {
    let self = this;
    const url = API_SERVER + 'api/user/' + id;
    window.fetch(url).then(function(response) {
        return response.json();
    }).then(function(result) {
        let fullName = `${result.data.givenname} ${result.data.middleinitial}. ${result.data.surname}`;
        self.setState({
            selectedName: fullName,
            content: Object.keys(result.data).map((key) => [key, result.data[key]])
        });
    });
    this.setState({open: true})
  }

  onChange(e) {
      const first = this.refs.firstname.getValue();
      const last = this.refs.lastname.getValue();
      let self = this;
      if (first + last) {
          const url = API_SERVER + `api/user/search?first=${first}&last=${last}`;
          window.fetch(url).then(function(response) {
              return response.json();
          }).then(function(result) {
              self.setState({results: result.data});
          });
      } else {
          self.setState({found: 0, results: []});
      }
  }

  render() {
    const tableData = this.state.results.map((record) => {
        return <tr key={record.Number}><td><a href="#" onClick={this.openModal.bind(null,record.Number)}>{record.surname + ', ' + record.givenname}</a></td></tr>
    });
    const modalContent = this.state.content.map((row, index) => {
        return <tr key={index}><th>{row[0]}</th><td>{row[1]}</td></tr>;
    });
    return (
        <div>
        <Grid>
        <Row>
        <Col md={3} mdOffset={3}>
        <Input
          ref='firstname'
          type='text'
          placeholder='First Name'
          onChange={this.onChange}
        />
        </Col>
        <Col md={3}>
        <Input ref='lastname' onChange={this.onChange} type='text' placeholder='Last Name' />
        </Col>
        </Row>
        <Row>
        <Col md={6} mdOffset={3}>
      <Table striped>
      <tbody>
      {tableData}
      </tbody>
      </Table>
      </Col>
      </Row>
      </Grid>
      <Modal show={this.state.open} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.selectedName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped>
            <tbody>
            {modalContent}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" bsSize="medium" onClick={this.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  }
}
