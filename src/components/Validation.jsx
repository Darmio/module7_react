import { useState } from "react";

function Validation() {
    const [error, setError] = useState([]);
};

export default Validation;

export const validate = (obj, err) => {
 
    if (!obj.name || obj.name.trim() === '') {
        err.push("Name cannot be blank.");
    }
    if (obj.name.length < 2) {
        err.push('Name cannot be shorter than 3 characters.');
    }
    if (obj.name.length > 100) {
        err.push('Name cannot be longer than 16 characters.');
    }

    if (!obj.description || obj.description.trim() === '') {
        err.push('Description cannot be blank.');
    }
    if (obj.description.length < 5) {
        err.push('Description cannot be shorter than 5 characters.');
    }
    if (obj.description.length > 150) {
        err.push('Description cannot be longer than 150 characters.');
    }

    if (!obj.price) {
        err.push('Price cannot be blank.');
    }
    if (isNaN(parseFloat(obj.price))) {
        err.push('Price must be a number or float.');
    }
    if (obj.price <= 0) {
        err.push('Price must be greater than 0');
    }
    if (!obj.duration) {
        err.push('Duration cannot be blank.');
    }
    if (isNaN(parseInt(obj.duration)) || parseInt(obj.duration) < 1) {
        err.push('Minimum duration is 1.');
    }

    return err;

}