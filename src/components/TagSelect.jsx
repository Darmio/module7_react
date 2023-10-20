
import React from "react";
import Select from "react-select";

/**
 * Wrapper for React-Select that enables props.value
 * to be the option.value id.
 */
export class Select2 extends React.Component {
  getSelectedOption() {
    // Simplified implementaion - works only for single selects.
    const { value, options } = this.props;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        return options[i];
      } else if (options[i].options) {
        for (let ii = 0; ii < options[i].options.length; ii++) {
          if (options[i].options[ii].value === value) {
            return options[i].options[ii];
          }
        }
      }
    }
    return null;
  }

  render() {
    const { value, ...rest } = this.props;
    return (
      <Select isMulti value={this.getSelectedOption()} {...rest} />
    );
  }
}

class TagSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ["1", "2" ]
    };
    this.options = [{ value: "1", label: "foo" }, { value: "2", label: "bar" }];
  }

  handleChange = (option) => {
    this.setState({ value: option.value});
  }
  render() {
    return (
      <Select2
        options={this.options}
        value={this.options}
        onChange={this.handleChange}
      />
    );
  }
}
export default TagSelect;