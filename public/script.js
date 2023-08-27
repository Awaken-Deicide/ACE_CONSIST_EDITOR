document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trainForm');
  form.addEventListener('submit', handleSubmit);

  const addRowBtn = document.getElementById('addRowBtn');
  addRowBtn.addEventListener('click', addTrainRow);

  function addTrainRow() {
    const tableBody = document.getElementById('trainTableBody');
    const newRow = document.createElement('tr');
    const newRowIndex = tableBody.children.length + 1; // Calculate the new row index
    newRow.id = `Train${newRowIndex}`;
    newRow.innerHTML = `
      <td><input type="text" name="trainNo${newRowIndex}"></td>
      <td><input type="text" name="returningTrainNo${newRowIndex}"></td>
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
    `;
    document.getElementById('trainTableBody').appendChild(newRow);
  }
});

function showPrompt(message) {
  alert(message);
}

function handleSubmit(event) {
  event.preventDefault();

  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  if (!fromDate || !toDate) {
    showPrompt('Please fill in both date fields.');
    return; // Stop form submission
  }

  const formData = [];

  const tableRows = document.querySelectorAll('#trainTableBody tr');
    tableRows.forEach(row => {
      const trainInfo = {
        trainNo: row.querySelector(`input[name^="trainNo"]`).value.toUpperCase(),
        returningTrainNo: row.querySelector(`input[name^="returningTrainNo"]`).value.toUpperCase(),
        loco1: row.querySelector(`input[name^="loco1-"]`).value,
        loco2: row.querySelector(`input[name^="loco1-"]`).value,
        car1: row.querySelector(`input[name^="car1-"]`).value,
        car2: row.querySelector(`input[name^="car2-"]`).value,
        car3: row.querySelector(`input[name^="car3-"]`).value,
        car4: row.querySelector(`input[name^="car4-"]`).value,
        car5: row.querySelector(`input[name^="car5-"]`).value,
        car6: row.querySelector(`input[name^="car6-"]`).value,
        car7: row.querySelector(`input[name^="car7-"]`).value,
        car8: row.querySelector(`input[name^="car8-"]`).value,
        // (extract input values)
      };

    formData.push(trainInfo);
  });

  formData.push({
    from_date: fromDate,
    to_date: toDate,
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
