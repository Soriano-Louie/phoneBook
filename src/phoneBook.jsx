// Part 2 letter B exercise - 2.6 - 2.10
import { useEffect, useState } from "react";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNum, setNum] = useState("");
  const [searchName, setSearchName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // console.log("effect");
    personService.getAll().then((intialPersons) => {
      setPersons(intialPersons);
    });
  }, []);
  console.log("render ", persons.length, " persons");

  const addPerson = (event) => {
    event.preventDefault();
    console.log(newName);
    console.log(newNum);
    let isNameDup = false;
    let isNumDup = false;
    persons.forEach((element) => {
      if (element.name.toLowerCase() === newName.toLowerCase()) {
        isNameDup = true;
      }
      if (element.number === parseInt(newNum)) {
        isNumDup = true;
      }
    });

    if (isNameDup) {
      const userConfirmed = confirm(
        newName +
          " is already added to phonebook, replace the old number with a new one?"
      );
      if (userConfirmed) {
        const personObject = {
          name: newName,
          number: newNum,
        };

        const person = persons.find((per) => per.name === newName);
        const id = person ? person.id : null;

        personService.update(id, personObject).then((returnedNum) => {
          console.log(newNum);
          console.log(id);
          setPersons(persons.map((per) => (per.id === id ? returnedNum : per)));
        });
      }
      return;
    } else {
      const personObject = {
        name: newName,
        number: newNum,
      };

      personService.create(personObject).then((newName) => {
        // console.log(newName);
        console.log("New Person from Backend:", newName);
        setPersons(persons.concat(newName));
        setNewName("");
        setNum("");
        setSuccessMessage(`Added '${personObject.name}'`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      });
    }
  };

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }

    return <div className="error">{message}</div>;
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    console.log(event.target.value);
    setNum(event.target.value);
  };

  const printPhoneBook = () => {
    if (!persons || !persons.length) {
      return <p>No contacts available</p>;
    }
    return persons.map((element) => (
      <div key={element.id}>
        {element.name} {element.number} &nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={() => deletePer(element.id)}> Delete</button>
        <br />
        <br />
      </div>
    ));
  };

  const deletePer = (id) => {
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((pers) => pers.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
        alert(`Failed to delete. It may have already been removed.`);
      });
  };

  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().startsWith(searchName.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <div>
        <input
          type="text"
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search by name"
        />
        {searchName && (
          <>
            {filteredPeople.map((element, index) => {
              return (
                <p key={index} className="elements">
                  {element.name} {element.number}
                </p>
              );
            })}
          </>
        )}
      </div>
      <br />
      <br />
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNum} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {/* <div>debug: {newName}</div> */}
      <div>{printPhoneBook()}</div>
    </div>
  );
};

export default App;
