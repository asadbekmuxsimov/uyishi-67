const groupsFilter = document.querySelector(".groups-filter");
const groupsSelect = document.querySelector(".groups-select");
const addStudentBtn = document.querySelector(".add-student-btn");
const openModalBtn = document.querySelector(".open-modal-btn");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector("#studentModal");
const studentsTable = document.querySelector(".students-table tbody");
const studentModalTitle = document.querySelector("#studentModalLabel");
const searchStudent = document.querySelector(".search-student");

let studentsJSON = localStorage.getItem(STUDENTS);
let students = JSON.parse(studentsJSON) || [];

let selected = null;
let group = localStorage.getItem(STUDENT_GROUP) || "all";

let search = "";

function getStudentRow({ firstName, lastName, group, doesWork }, i) {
  return `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${group}</td>
      <td>${doesWork ? "Ha" : "Yo'q"}</td>
      <td class="text-end">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#studentModal" onclick="editStudent(${i})">Edit</button>
        <button onclick="deleteStudent(${i})" class="btn btn-danger">Delete</button>
      </td>
    </tr>
  `;
}

function getStudents() {
  studentsTable.innerHTML = "";
  let result = students.filter((student) => {
    let matchesSearch =
      student.firstName?.toLowerCase().includes(search) ||
      student.lastName?.toLowerCase().includes(search);
    let matchesGroup = group === "all" || student.group === group;
    return matchesSearch && matchesGroup;
  });
  
  if (group !== "all") {
    result = result.filter((student) => student.group === group);
  }
  result.forEach((student, i) => {
    studentsTable.innerHTML += getStudentRow(student, i);
  });
}

getStudents();

function getGroupOption(gr) {
  return `<option ${gr === group ? "selected" : ""} value="${gr}">${gr}</option>`;
}

groupsFilter.innerHTML = `<option value='all'>All</option>`;
let groupOptions = "";
groups.forEach((group) => {
  groupOptions += getGroupOption(group);
});
groupsFilter.innerHTML += groupOptions;
groupsSelect.innerHTML = groupOptions;

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  if (studentForm.checkValidity()) {
    let firstName = studentForm.elements.firstName.value;
    let lastName = studentForm.elements.lastName.value;
    let group = studentForm.elements.group.value;
    let doesWork = studentForm.elements.doesWork.checked;
    let student = { firstName, lastName, group, doesWork };
    if (selected === null) {
      students.push(student);
    } else {
      students = students.map((el, i) => (i === selected ? student : el));
    }
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
    bootstrap.Modal.getInstance(studentModal).hide();
  } else {
    studentForm.classList.add("was-validated");
  }
});

openModalBtn.addEventListener("click", function () {
  addStudentBtn.textContent = "Add";
  studentModalTitle.textContent = "Adding student";
  studentForm.elements.firstName.value = "";
  studentForm.elements.lastName.value = "";
  studentForm.elements.group.value = groups[0];
  studentForm.elements.doesWork.checked = false;
});

function editStudent(i) {
  selected = i;
  addStudentBtn.textContent = "Save";
  studentModalTitle.textContent = "Editing student";
  let { firstName, lastName, group, doesWork } = students[i];
  studentForm.elements.firstName.value = firstName;
  studentForm.elements.lastName.value = lastName;
  studentForm.elements.group.value = group;
  studentForm.elements.doesWork.checked = doesWork;
}

function deleteStudent(i) {
  if (confirm("Do you want to delete this student!")) {
    students = students.filter((_, index) => index !== i);
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
  }
}


groupsFilter.addEventListener("change", function () {
    group = this.value;
    localStorage.setItem(STUDENT_GROUP, group);
    getStudents();
  });
  
  searchStudent.addEventListener("keyup", function () {
    search = this.value.trim().toLowerCase();
    getStudents();
  });
  