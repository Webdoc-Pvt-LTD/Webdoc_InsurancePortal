import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../Config";

const ClaimApproval = () => {
  const [data, setData] = useState([]);
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to show loader/message
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}ClaimApproval`, {
        headers: { 'accept': '*/*' },
      });
      console.log("Fetched Data: ", response.data.claim_Data); // Debugging log
      if (response.data.claim_Data && response.data.claim_Data.length > 0) {
        setData(response.data.claim_Data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false); // Set loading state to false once API call is complete
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch on component mount

    const intervalId = setInterval(() => {
      fetchData(); // Refresh data every 5 minutes (300,000ms)
    }, 300000); // 5 minutes

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const handleDetailsClick = (customerMobileNo, claim_No) => {
    navigate(`/Claim_Details/${customerMobileNo}/${claim_No}`);
  };

  const handleInputChange = (e, rowIndex) => {
    const { name, value } = e.target;

    if (data[rowIndex]) {
      const newData = [...data];
      newData[rowIndex][name] = value; // Update the value for the given row
      setData(newData);
    }
  };

  const handleSubmitClick = async (rowIndex) => {
    if (!data[rowIndex]) {
      console.error(`No data found for row index ${rowIndex}`);
      return;
    }

    const { claim_Id, status, paid_Amount, note } = data[rowIndex];

    try {
      await axios.post(`${BASE_URL}ClaimCompleted`, null, {
        params: {
          claim_Id,
          Status: status,
          AmountPaid: paid_Amount,
          Note: note,
        },
        headers: { 'accept': '*/*' },
      });
      alert('Claim submitted successfully');
      setEditableRowIndex(null); // Reset editable row index after submitting
      // Refresh the data
      await fetchData(); // Refresh after submission
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim');
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Claim_No', accessor: 'claim_No' },
      {
        Header: "Customer_Details", accessor: "amount",
        Cell: ({ row }) => (
          <div>
            <div><b>Name:</b> {row.original.customerName}</div>
            <div><b>ContactNo:</b> {row.original.customerMobileNo}</div>
            <div><b>AccountNo:</b> {row.original.customerAccountNo}</div>
          </div>
        )
      },
      { Header: 'Service', accessor: 'customerService' },
      {
        Header: "Date",
        Cell: ({ row }) => (
          <div>
            <div><b>Claim:</b> {row.original.claimDate}</div>
            <div><b>Processing:</b>  {row.original.processingDate}</div>
          </div>
        )
      }, {
        Header: "Total_Amount",
        Cell: ({ row }) => (
          <div>
            <div><b>Expense </b> {row.original.expense_Amount}</div>
            <div><b>Payable</b>  {row.original.payable_Amount}</div>
          </div>
        )
      },
      {
        Header: 'Paid_Amount',
        accessor: 'paid_Amount',
        Cell: ({ row }) => (
          editableRowIndex === row.index ? (
            <Form.Control
              type="number"
              name="paid_Amount"
              value={row.original.paid_Amount}
              onChange={(e) => handleInputChange(e, row.index)}
            />
          ) : (
            row.original.paid_Amount
          )
        ),
      },
      {
        Header: 'Status', accessor: 'status',
        Cell: ({ row }) => (
          editableRowIndex === row.index ? (
            <Form.Control as="select" name="status" value={row.original.status} onChange={(e) => handleInputChange(e, row.index)} >
              <option value={row.original.status}>{row.original.status}</option>
              <option value="Hold">Hold</option>
              <option value="Rejected">Rejected</option>
              <option value="Approved">Approved</option>
            </Form.Control>
          ) : (
            row.original.status
          )
        ),
      },
      {
        Header: 'Note', accessor: 'note',
        Cell: ({ row }) => (
          editableRowIndex === row.index ? (
            <Form.Control
              type="text"
              name="note"
              value={row.original.note || ''} // Default to empty string if no note
              onChange={(e) => handleInputChange(e, row.index)} // Use row.index here
            />
          ) : (
            row.original.note
          )
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <div>
            <Button
              variant="primary"
              onClick={() => handleDetailsClick(row.original.customerMobileNo, row.original.claim_No)}
              className="m-2"
            >
              Details
            </Button>
            {editableRowIndex === row.index ? (
              <>
                <Button
                  variant="success"
                  onClick={() => handleSubmitClick(row.index)}
                  className="m-2"
                >
                  Submit
                </Button>
                <Button
                  variant="warning"
                  onClick={() => setEditableRowIndex(null)}
                  className="m-2"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="success"
                onClick={() => setEditableRowIndex(row.index)}
                className="m-2"
              >
                Edit
              </Button>
            )}
          </div>
        ),
      },
    ],
    [editableRowIndex]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="container mt-5">
      <h2>Claims Data</h2>
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching data
      ) : error ? (
        <p>{error}</p> // Show error message if API fails
      ) : data.length === 0 ? (
        <p>No data available</p> // Show message if no data is returned
      ) : (
        <div className="table-responsive">
          <table {...getTableProps()} className="table">
            <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.original.claim_Id}>
                  {row.cells.map((cell) => (
                    <td key={cell.column.id} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimApproval;
