import Certificate from "./Certificate"

function CertificateRow({list}) {

    const loadRow = (list) => {

        if (!list)
            return null;
        const list = [];

        for (const item of list) {
            row.push(
                <tr className="tableRow">
                    <td>{new Date(item.createDate).toLocaleString()}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.duration}</td>
                    <td>{item.price}</td>
                    <td>{item.tags.map(tag => tag.name).toString()}</td>
                    <td>
                        <button type="button" onClick={onEditBtnClick} className="btn btn-warning"
                                data-certificate-id={item.id}>
                            <i className="bi-pencil"></i>
                        </button>
                    </td>
                    <td>
                        <button type="button" onClick={onDeleteBtnClick} className="btn btn-danger"
                                data-certificate-id={item.id}>
                            <i className="bi-x-lg"></i>
                        </button>
                    </td>

                </tr>
            )
        }
        return row;
    }


    return (
        <div className="col-12">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Price</th>
                        <th scope="col">Tags</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {loadRow(list)}
                </tbody>
            </table>
        </div>
    )
};

export default CertificateRow;