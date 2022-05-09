import { useEffect, useState, Fragment } from "react";
import './App.css';
import ReadOnlyRow from "./Componets/ReadOnlyRow";
import EditableRow from "./Componets/EditableRow";
import { nanoid } from "nanoid";




function App() {

  const url = 'https://becode-interviews.herokuapp.com/blood_tests';
  const Authid = "T1004588ULD1VLRRSK4U";
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState([]);


  useEffect(() => {
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth-iD': Authid,
      }
    }).then((result) => {
      result.json().then((res) => {
        setContacts(res)
      }).catch((err) => {
        setError(err)
      })
    })

  }, [url])

  const [addForm, setAddForm] = useState({
    id: nanoid(),
    name: "",
    test_date: "",
    value: ""
  })
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    value: "",
    test_date: "",
  });

  const [editContactId, setEditContactId] = useState(null);



  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addForm };

    newFormData[fieldName] = fieldValue;
    setAddForm(newFormData);

  };


  function handleAddFormSubmit(event) {
    event.preventDefault();

    let newFormData = {
      id: nanoid(),
      name: addForm.name,
      value: addForm.value,
      test_date: addForm.test_date
    };
    fetch(`https://becode-interviews.herokuapp.com/blood_tests/`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth-iD': 'T1004588ULD1VLRRSK4U',
      },
      body: JSON.stringify(newFormData),
    })
      .then(resp => resp.json())

    const newTests = [...contacts, newFormData]
    setContacts(newTests)


  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    let editedContact = {
      id: editContactId,
      name: editFormData.name,
      value: editFormData.value,
      test_date: editFormData.test_date
    };


    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === editContactId);
    newContacts[index] = editedContact;

    fetch(`https://becode-interviews.herokuapp.com/blood_tests/${editedContact.id}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth-iD': 'T1004588ULD1VLRRSK4U',
      },
      body: JSON.stringify(editFormData),
    })
      .then(resp => resp.json())

    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      name: contact.name,
      value: contact.value,
      test_date: contact.test_date,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    fetch(`https://becode-interviews.herokuapp.com/blood_tests/${contactId}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth-iD': Authid,
      },
    })
      .then(resp => resp.json())

    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };


  return (
    <div className="app-container">
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Test_date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <Fragment key={index}>
                {editContactId === contact.id ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Add a test_blood</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="name"
          required="required"
          placeholder="Enter a name..."
          onChange={handleAddFormChange}
        />
        <input
          type="number"
          name="value"
          required="required"
          placeholder="Enter an value..."
          onChange={handleAddFormChange}
        />
        <input
          type="date"
          name="test_date"
          required="required"
          placeholder="Enter a date..."
          onChange={handleAddFormChange}
        />

        <button type="submit">Add</button>
      </form>
    </div>
  );
};


export default App;
