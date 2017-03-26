import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import App, { Search, Button, Table, Sort } from "./App";

describe("App", () => {
  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });

  test("snapshot", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Search", () => {
  const handler = (event) => { };
  const props = {
    value: "search",
    onChange: handler,
    onSubmit: handler
  };

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search { ...props }>Search</Search>, div);
  });

  test("snapshots", () => {
    const component = renderer.create(
      <Search { ...props }>Search</Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Button", () => {
  const handler = (event) => { };
  const props = {
    onClick: handler
  }

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button { ...props }>More</Button>, div);
  });

  test("snapshots", () => {
    const component = renderer.create(
      <Button { ...props }>More</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Table", () => {
  const handler = (event) => { };
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
    ],
    onDismiss: handler,
  }

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table { ...props } />, div)
  });

  test("snapshots", () => {
    const component = renderer.create(
      <Table { ...props } />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two items in list", () => {
    const element = shallow(
      <Table { ...props } />
    );
    expect(element.find(".table-row").length).toBe(2);
  });
});

describe("Sort", () => {
  const handler = (event) => { };
  const props = {
    sortKey: "key",
    activeSortKey: "key",
    isSortReverse: false,
    onSort: handler
  }

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Sort { ...props } />, div)
  });

  test("snapshots", () => {
    const component = renderer.create(
      <Sort { ...props } />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
