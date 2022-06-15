import { useState } from 'react';
import { v4 as myNewID } from 'uuid';

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  const [itemToDo, setItemToDo] = useState("");
  const [itemToSearch, setItemToSearch] = useState("");
  const [items, setItems] = useState([
    {
      key: myNewID(),
      label: "Have fun",
    },
    {
      key: myNewID(),
      label: "Spread Empathy",
    },
    {
      key: myNewID(),
      label: "Generate Value",
    },
  ]);

  const [filterType, setFilterType] = useState("all");

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  }

  const handleSearch = (event) => {
    setItemToSearch(event.target.value);
  }

  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo }

    // Push мутирует (as well as splice shift unshift) --- Плохо
    // const newItems = items;
    // newItems.push(newItem)
    // setItems([...newItems])
    if (itemToDo.trim() === "") {

    } else {
      setItems((prevItem) => [newItem, ...prevItem]);
    }
    setItemToDo("");
  }

  const handleKeyPress = e => {
    if (e.keyCode === 13) {
      handleAddItem();
    }
  }

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        ///function here
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  };

  const handleItemDelete = ({ key }) => {
    const findIndex = items.findIndex((item) => item.key === key)

    const leftSide = items.slice(0, findIndex)
    const rightSide = items.slice(findIndex + 1, items.length)
    setItems((prevItem) => [...leftSide, ...rightSide])
  }

  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  }

  const moreToDo = items.filter((item) => !item.done).length;
  const doneToDo = items.filter((item) => item.done).length;

  const filteredArray =
    filterType === "all"
      ? items
      : filterType === "done"
        ? items.filter((item) => item.done)
        : items.filter((item) => !item.done);

  const filteredTwice = itemToSearch ? filteredArray.filter((item) => item.label.toLowerCase().includes(itemToSearch)) : filteredArray


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>{moreToDo} more to do, {doneToDo} done</h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={itemToSearch}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {/* Button group */}

          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${filterType === item.type ? "" : "btn-outline-info"
                }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* List-group */}
      <ul className="list-group todo-list">

        {filteredTwice.length > 0 &&
          filteredTwice.map((item) => (
            <li key={item.key} className="list-group-item" >
              <span className={`todo-list-item ${item.done ? "done" : ""} ${item.important ? "important" : ""}`}>
                <span className="todo-list-item-label" onClick={() => handleItemDone(item)}>{item.label}</span>

                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleItemImportant(item)}
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  key={myNewID()}
                  onClick={() => handleItemDelete(item)}
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
          onKeyUp={handleKeyPress}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>Add item</button>
      </div>
    </div>
  );
}

export default App;