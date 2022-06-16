import { useState, useEffect } from "react";
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
  const loadTasks = () => {
    let itemsParsed = []
    for (let i = 0; i < localStorage.length; i++) {
      let itemValue = localStorage.getItem(localStorage.key(i)).split(';')
      let itemLabel = itemValue[0].split(':')[1]
      let itemDone = null
      let itemImp = null
      if (itemLabel) {
        if (itemValue[1]) {
          itemDone = itemValue[1].split(':')[1]
          if (itemValue[2]) {
            itemImp = itemValue[2].split(':')[1]
          }
          itemsParsed[i] = {
            key: localStorage.key(i),
            label: itemLabel,
            done: itemDone === "true",
            important: itemImp === "true",
          }
        }
      }
    }
    return (itemsParsed);
  }

  const handleChangeDone = (item) => {
    let value = localStorage.getItem(item.key)
    if (item.done === true) {
      value = value.replace("done:true", "done:false")
    } else {
      value = value.replace("done:false", "done:true")
    }
    console.log(value)
    localStorage.setItem(item.key, value)
  }

  const handleChangeImp = (item) => {
    let value = localStorage.getItem(item.key)
    if (item.important === true) {
      value = value.replace("important:true", "important:false")
    } else {
      value = value.replace("important:false", "important:true")
    }
    console.log(value)
    localStorage.setItem(item.key, value)
  }

  const [items, setItems] = useState(() => loadTasks())
  // const [items, setItems] = useState([
  //   {
  //     key: myNewID(),
  //     label: "Have fun",
  //     value: "label:Have fun;done:false;important:false",
  //   },
  //   {
  //     key: myNewID(),
  //     label: "Spread Empathy",
  //     value: "label:Spread Empathy;done:true;important:true",
  //   },
  //   {
  //     key: myNewID(),
  //     label: "Generate Value",
  //     value: "label:Generate Value;done:false;important:true",
  //   }
  // ]);

  const [filterType, setFilterType] = useState("all");

  // localStorage.setItem(testItems[0].key, testItems[0].value)
  // localStorage.setItem(testItems[1].key, testItems[1].value)
  // localStorage.setItem(testItems[2].key, testItems[2].value)
  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  }

  const handleSearch = (event) => {
    setItemToSearch(event.target.value);
  }

  const handleAddItem = () => {

    // Push мутирует (as well as splice shift unshift) --- Плохо
    // const newItems = items;
    // newItems.push(newItem)
    // setItems([...newItems])
    if (itemToDo.trim() === "") {

    } else {
      const newItem = { key: myNewID(), label: itemToDo }
      let newValue = `label:${newItem.label};done:false;important:false`
      localStorage.setItem(newItem.key, newValue)
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
          handleChangeDone(item)
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        ///function herehandleItemImportant
        if (item.key === key) {
          handleChangeImp(item)
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  };

  const handleItemDelete = ({ key }) => {
    localStorage.removeItem(key)
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

  const filteredTwice = itemToSearch ? filteredArray.filter((item) => item.label.toLowerCase().includes(itemToSearch.toLowerCase())) : filteredArray


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
              <span className={`todo-list-item ${(item.done === true) ? "done" : ""} ${(item.important === true) ? "important" : ""}`}>
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