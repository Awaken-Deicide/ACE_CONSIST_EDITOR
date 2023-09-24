document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trainForm');
  form.addEventListener('submit', handleSubmit);

  const addRowBtn = document.getElementById('addRowBtn');
  addRowBtn.addEventListener('click', addTrainRow);

  // Fetch data from the server and populate form fields
  fetch('/api/trains')
    .then(response => response.json())
    .then(data => {
      // Check if data contains both dates and trains properties
      if (data.dates && data.trains) {
        // Populate dates
        document.getElementById('fromDate').value = data.dates.from_date || '';
        document.getElementById('toDate').value = data.dates.to_date || '';

        // Populate train rows
        populateFormFields(data.trains);
      }
    })
    .catch(error => console.error(error));

  // Delete row buttons functionality
  const deleteRowButtons = document.querySelectorAll('.deleteRowBtn');
  deleteRowButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.parentElement.parentElement; // Get the parent row of the delete button
      row.parentElement.removeChild(row);
    });
  });
});

function populateFormFields(formData) {
  const tableRows = document.querySelectorAll('#trainTableBody tr');
  formData.forEach((trainInfo, index) => {
    const row = tableRows[index];
    if (row) {
      for (const key in trainInfo) {
        if (key !== '_id' && key !== '__v') {
          // Skip _id and __v properties
          const inputField = row.querySelector(`input[name^="${key}"]`);
          if (inputField) {
            inputField.value = trainInfo[key];
          }
        }
      }
    }
  });
}

function addTrainRow() {
  const tableBody = document.getElementById('trainTableBody');
  const newRow = document.createElement('tr');
  const newRowIndex = tableBody.children.length + 1; // Calculate the new row index
  newRow.id = `Train${newRowIndex}`;
  newRow.innerHTML = `
    <td><input type="text" name="trainNo-${newRowIndex}"></td>
    <td><input type="text" name="returningTrainNo-${newRowIndex}"></td>
    <td><input type="text" name="loco1-${newRowIndex}"></td>
    <td><input type="text" name="loco2-${newRowIndex}"></td>
    <td><input type="text" name="car1-${newRowIndex}"></td>
    <td><input type="text" name="car2-${newRowIndex}"></td>
    <td><input type="text" name="car3-${newRowIndex}"></td>
    <td><input type="text" name="car4-${newRowIndex}"></td>
    <td><input type="text" name="car5-${newRowIndex}"></td>
    <td><input type="text" name="car6-${newRowIndex}"></td>
    <td><input type="text" name="car7-${newRowIndex}"></td>
    <td><input type="text" name="car8-${newRowIndex}"></td>
    <td><button type="button" class="deleteRowBtn bg-purple-700 hover:bg-purple-800 text-white py-1 px-2 rounded">Delete</button></td>
  `;
  tableBody.appendChild(newRow);

  // Add event listener to the delete button
  newRow.querySelector('.deleteRowBtn').addEventListener('click', () => {
    tableBody.removeChild(newRow);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  if (!fromDate || !toDate) {
    showPrompt('Please fill in both date fields.');
    return; // Stop form submission
  }

  const formData = {
    dates: {
      from_date: fromDate,
      to_date: toDate,
    },
    trains: [], // Initialize an empty array for trains data
  };

  const tableRows = document.querySelectorAll('#trainTableBody tr');
  tableRows.forEach(row => {
    const trainInfo = {
      trainNo: row.querySelector(`input[name^="trainNo"]`).value.toUpperCase(),
      returningTrainNo: row.querySelector(`input[name^="returningTrainNo"]`).value.toUpperCase(),
      loco1: row.querySelector(`input[name^="loco1-"]`).value,
      loco2: row.querySelector(`input[name^="loco2-"]`).value,
      car1: row.querySelector(`input[name^="car1-"]`).value,
      car2: row.querySelector(`input[name^="car2-"]`).value,
      car3: row.querySelector(`input[name^="car3-"]`).value,
      car4: row.querySelector(`input[name^="car4-"]`).value,
      car5: row.querySelector(`input[name^="car5-"]`).value,
      car6: row.querySelector(`input[name^="car6-"]`).value,
      car7: row.querySelector(`input[name^="car7-"]`).value,
      car8: row.querySelector(`input[name^="car8-"]`).value,
    };

    formData.trains.push(trainInfo);
  });

  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.text())
    .then(message => {
      showPrompt(message); // Show prompt when data file is created
      console.log(message);
    })
    .catch(error => console.error(error));
}

function showPrompt(message) {
  alert(message);
}
