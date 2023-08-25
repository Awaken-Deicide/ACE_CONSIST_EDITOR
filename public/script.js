document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trainForm');
  form.addEventListener('submit', handleSubmit);
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

  for (let i = 1; i <= 4; i++) {
    const trainInfo = {
      trainNo: document.getElementsByName(`trainNo${i}`)[0].value,
      returningTrainNo: document.getElementsByName(`returningTrainNo${i}`)[0].value,
      loco1: document.getElementsByName(`loco1${i}`)[0].value,
      loco2: document.getElementsByName(`loco2${i}`)[0].value,
      car1: document.getElementsByName(`car1${i}`)[0].value,
      car2: document.getElementsByName(`car2${i}`)[0].value,
      car3: document.getElementsByName(`car3${i}`)[0].value,
      car4: document.getElementsByName(`car4${i}`)[0].value,
      car5: document.getElementsByName(`car5${i}`)[0].value,
      car6: document.getElementsByName(`car6${i}`)[0].value,
      car7: document.getElementsByName(`car7${i}`)[0].value,
      car8: document.getElementsByName(`car8${i}`)[0].value,
    };

    formData.push(trainInfo);
  }

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
