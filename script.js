console.log("It is working");

// Function to show/hide the popup
const openEl = document.querySelector(".open-modal");
const closeEl = document.querySelector(".modal-close");
const modal = document.querySelector(".modal"),
  borrowedEl = modal.querySelector(".borrowed"),
  dateBorrowedEl = modal.querySelector(".date-borrowed");

const isVisible = "is-visible";

openEl.addEventListener("click", function () {
  modal.classList.add(isVisible);
});

closeEl.addEventListener("click", function () {
  modal.classList.remove(isVisible);
});

// Get the older date
const olderDate = new Date("2023-04-30");


// Format the date into "Month Day, Year" format
const formattedDate = olderDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

dateBorrowedEl.textContent = formattedDate;

console.log(
  `75 days before July 14, 2023: ${formattedDate}, so it was exactly borrowed on this day`
);

// Get the current date
const currentDate = new Date();

// Calculate the difference in milliseconds
const differenceInMs = currentDate - olderDate;

const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

console.log(
  `The difference between the older date and the present day is approximately ${differenceInDays}days.`
);

let amountBorrowed = 24000;

borrowedEl.textContent = `${amountBorrowed}`;

let rate = 0.003;

const selectRange = document.getElementById('selectRange');
const data = interest(amountBorrowed, rate)[1];

const numberOfOptions = Math.ceil(data.length / 10);

// Generate options for select dropdown
for (let i = 1; i <= numberOfOptions; i++) {
  const start = (i - 1) * 10 + 1;
  const end = Math.min(i * 10, data.length);
  const option = document.createElement('option');
  option.value = i;
  option.textContent = `${start}-${end}`;
  selectRange.appendChild(option);
}

// Event listener for select change
selectRange.addEventListener('change', function() {
  updateTable(interest(amountBorrowed, rate)[1]);
});

// Trigger initial display for the first range (1-10)
selectRange.value = `${Math.ceil(differenceInDays / 10)}`;
selectRange.dispatchEvent(new Event('change'));



function interest(amountBorrowed, rate) {
  const olderDate = new Date("2023-05-1");
  let balanced = amountBorrowed;
  let array = [];

  let index = 1;
  const incrementDate = new Date(olderDate); // Create a copy to increment the date
  const currentDate = new Date(); // Get the current date

  const futureDays = (Math.ceil(differenceInDays / 10) * 10) - differenceInDays;

  while (incrementDate <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + futureDays)) { // Exit loop when incrementDate surpasses current date
    const dailyInterest = balanced * rate; // Calculate daily interest
    balanced += dailyInterest;
    array.push({
      day: index,
      date: incrementDate.toLocaleDateString(),
      amount: balanced,
      dailyInterest: dailyInterest
    });
    incrementDate.setDate(incrementDate.getDate() + 1); // Increment date by 1 day
    index++;
  }
  const todayBalance = array[array.length - (futureDays + 1)].amount

  return [todayBalance, array];
}


console.log(interest(amountBorrowed, rate));

output.textContent = `₦${interest(amountBorrowed, rate)[0].toFixed(2)}`;

function updateTable(array) {
  const tableData = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

  const selectedValue = parseInt(selectRange.value);
  const start = (selectedValue - 1) * 10;
  const end = Math.min(selectedValue * 10, array.length);
  

  tableData.innerHTML = ''; // Clear previous table data

  const selectedObjects = array.slice(start, end); // Get the last 10 elements of the array

  const today = new Date().toLocaleDateString(); // Get today's date in the same format as stored in the objects


  for (let i = 0; i < selectedObjects.length; i++) {
    const row = tableData.insertRow();
    const dayCell = row.insertCell(0);
    const dateCell = row.insertCell(1);
    const amountCell = row.insertCell(2);
    const dailyInterestCell = row.insertCell(3);

    if (selectedObjects[i].date === today) {
      dayCell.textContent = 'Today';
    } else {
      dayCell.textContent = selectedObjects[i].day;
    }

    dateCell.textContent = selectedObjects[i].date;
    amountCell.textContent = selectedObjects[i].amount.toFixed(2);
    dailyInterestCell.textContent = selectedObjects[i].dailyInterest.toFixed(2)

    const rowDate = new Date(selectedObjects[i].date);
    if (rowDate > new Date()) {
      row.classList.add('inactive');
    }
  }
}

