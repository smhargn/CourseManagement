
let courses = [];
let students = [];


const displayCourse = document.querySelector('.displayCourse');
const displayStudent = document.querySelector('.displayStudent');


displayStudent.addEventListener('click',displayStudents);

displayCourse.addEventListener('click',displayCourses);


document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function() {
      const targetClass = this.getAttribute('data-target');
      const targetElement = document.querySelector(`.${targetClass}`);
      
      // Tüm ekranları kapat
      document.querySelectorAll(`
          .welcome,
          .addCourseScreen,
          .addStudentScreen,
          .registerDiv,
          .display,
          .manageStudents,
          .searchStudents
      `).forEach(screen => {
          screen.style.display = 'none';
      });

      
      targetElement.style.display = 'block';
  });
});

class course {
  constructor(courseCode,courseName,courseInstructor,coursePointScale){
      this.courseCode = courseCode;
      this.courseName = courseName;
      this.courseInstructor = courseInstructor;
      this.coursePointScale = coursePointScale;

      this.studentsList = [];
  }
}

class student {
  constructor(id,name){
      this.id = id;
      this.name = name;

      this.courseList = [];
  }
}

function createCourse(courseCode,courseName,courseInstructor,coursePointScale)  {
  let obj = new course(courseCode,courseName,courseInstructor,coursePointScale);
  courses.push(obj);


}

function resetForm(formId) {
const form = document.getElementById(formId);
const inputs = form.querySelectorAll("input");
const select = form.querySelector("select");

inputs.forEach(input => input.value = "");

if (select) {
  select.selectedIndex = 0;
}
}


function addCourse(e){
  e.preventDefault();
  
  let courseCode = document.getElementById('courseCode').value;
  let courseName = document.getElementById('courseName').value;
  let courseInstructor = document.getElementById('instructor').value;
  let coursePointScale = document.getElementById('pointScale').value;

  if (/\d/.test(courseName)) {
    alert("Name Cannot be include number");
    return;
  }else if (/\d/.test(courseInstructor)) {
    alert("Name Cannot be include number");
    return ;
  }

  if (courses.some(course => course.courseCode.toLowerCase() === courseCode.toLowerCase())) {
    alert("Enter Different Course Code !");
    return;
  }else if (courses.some(course => course.courseName.toLowerCase() === courseName.toLowerCase())){
    alert("Enter Different Course Name !");
    return;
  }else if (courseCode.length > 9 || courseName.length > 50 || courseInstructor.length > 40 ){
    alert("Too long for inputs");
    return;
  }
  

  createCourse(courseCode,courseName,courseInstructor,coursePointScale);
  resetForm("courseForm");

  updateCourseList(courseList);
  updateCourseList(courseListinDisplay);
}

function addStudent(e){
  e.preventDefault();
  let studentID = document.getElementById('studentID').value;
  let studentName = document.getElementById('studentName').value;

  if (!/^\d+$/.test(studentID)) {
    alert("Student ID must contain only numbers!");
    return;
  }else  if (/\d/.test(studentName)) {
    alert("Name Cannot be include number");
    return;
  }

  if (students.some(student => student.id === studentID)) {
    alert("Enter Different Student ID !");
    return;
  }else if (studentID.length > 9) {
    alert("Student ID too Long");
    return;
  }else if (studentName.length > 40){
    alert("Student Name too long")
    return;
  }

  createStudent(studentID,studentName)
  resetForm("studentForm");
}

function createStudent(id,name)  {
  let obj = new student(id,name);
  students.push(obj);
  updateStudentList();
  

}

function updateStudentList(){
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = ""

  for(let student of students){
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = student.name;
      studentList.appendChild(option);
  }

}

function updateCourseList(updateCourse) {

const updateCourseId = updateCourse.id; 
const updateSection = document.getElementById(updateCourseId);

updateSection.innerHTML = ""; 

for (let course of courses) {
    const option = document.createElement("option");
    option.value = course.courseName;
    option.textContent = course.courseName;
    updateSection.appendChild(option);
}
}

const letterToGPA = {
"A": 4.0,
"B": 3.0,
"C": 2.0,
"D": 1.0,
"F": 0.0
};


function calcLetter(mid, fin, pointScale) {

  let midterm = parseInt(mid)
  let final = parseInt(fin)

  result = ((midterm * 40) + (final * 60)) / 100;
  if (pointScale == 7) {
    if (100 >= result && result >= 93) {
      return "A";
    }
    else if (93 > result && result >= 85) {
      return "B";
    }
    else if (85 > result && result >= 77) {
      return "C";
    }
    else if (77 > result && result >= 70) {
      return "D";
    }
    else if (70 > result) {
      return "F";
    }
  }
  else if (pointScale == 10) {
    if (100 >= result && result >= 90) {
      return "A";
    }
    else if (90 > result && result >= 80) {
      return "B";
    }
    else if (80 > result && result >= 70) {
      return "C";
    }
    else if (70 > result && result >= 60) {
      return "D";
    }
    else if (60 > result) {
      return "F";
    }
  }
}

function register(){
  let courseSelect = document.getElementById('courseList').value;
  let studentSelect = document.getElementById('studentList').value;
  let midterm = document.getElementById('midterm').value;
  let final = document.getElementById('final').value;

  let selectedCourse = null;
  let selectedStudent = null;


  if (Number(midterm) > 100 || Number(final) > 100) {
    alert("Midterm or Final cannot be higher than 100 Points!");
    return;
  }


  for ( let course of courses){
      if(courseSelect == course.courseName){
          selectedCourse = course;
      }
  }

  for ( let student of students){
      if(studentSelect == student.id){
          selectedStudent = student;
      }
  }

  let alreadyRegistered = selectedStudent.courseList.some(
    (course) => course.courseName.courseName === selectedCourse.courseName
  );

  if (alreadyRegistered) {
      alert("Already Registered to This Course");
      return;
    }

  let addCourseWithPoint = {
      courseName : selectedCourse,
      pointScale:selectedCourse.coursePointScale,
      midterm : midterm,
      final : final,
      grade : calcLetter(midterm,final,selectedCourse.coursePointScale)
  }



  selectedStudent.courseList.push(addCourseWithPoint);
  selectedCourse.studentsList.push(selectedStudent);
  resetForm("registerForm");


}





function displayCourses() {
    const courseContainer = document.getElementById("courseContainer");
    const tableBody = document.querySelector("#courseTable tbody");
    tableBody.innerHTML = ""; 

    
    courses.forEach(course => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.courseInstructor}</td>
            <td>${course.coursePointScale}</td>
            
        `;

        tableBody.appendChild(row);
    });

    
    const courseCount = document.getElementById("courseCount");
    courseCount.textContent = `Total Courses: ${courses.length}`;

    courseContainer.style.display = "block";
}

function displayStudents() {
  const studentContainer = document.getElementById("studentContainer");
  const tableBody = document.querySelector("#studentTable tbody");
  let selectedCourseForStudents = document.getElementById('courseListinDisplay').value;
  let selectedFilter = document.getElementById("studentFilter").value; 
  tableBody.innerHTML = ""; 

  let failedCount = 0;
  let passedCount = 0;

  students.forEach(student => {
      const courseForStudent = student.courseList.find(course => course.courseName.courseName === selectedCourseForStudents);
      
      if (courseForStudent) {
          const isFailed = courseForStudent.grade === 'F';
          
          
          if (selectedFilter === "failed" && !isFailed) return;
          if (selectedFilter === "passed" && isFailed) return;

          const row = document.createElement("tr");

          row.innerHTML = `
              <td>${student.id}</td>
              <td>${student.name}</td>
              <td>${selectedCourseForStudents}</td>
              <td>${courseForStudent.midterm}</td>
              <td>${courseForStudent.final}</td>
              <td>${courseForStudent.grade}</td>
              <td><button onclick="enableEditScores(this, ${student.id})">Edit</button> </td>
          `;

          tableBody.appendChild(row);

          
          if (isFailed) {
              failedCount++;
          } else {
              passedCount++;
          }
      }
  });

  const studentCount = document.getElementById("studentCount");
  studentCount.textContent = `Failed Students: ${failedCount}, Passed Students: ${passedCount}`;

  studentContainer.style.display = "block";
}






function manageStudents() {
  const tableBody = document.querySelector("#manageTable tbody");


  tableBody.innerHTML = "";

  students.forEach(student => {
    
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td><button onclick="enableEdit(this, ${student.id})">Edit</button>
        <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
        
      `;

      tableBody.appendChild(row);
    
  });
}

function deleteStudent(studentId) {
  
  const studentIndex = students.findIndex((s) => s.id === String(studentId));
  if (studentIndex > -1) {
    students.splice(studentIndex, 1);
  }
  
  manageStudents();
  
  const studentCount = document.getElementById("studentCount");
  studentCount.textContent = `Total Students: ${students.length}`;
}

function enableEditScores(button,studentId){
  const row = button.parentElement.parentElement; 
  const cells = row.querySelectorAll("td");

  
  const courseName = cells[2].textContent;
  cells[3].innerHTML = `<input type="number" value="${cells[3].innerText}" />`;
  cells[4].innerHTML = `<input type="text" value="${cells[4].innerText}" />`;

  
  button.innerText = "Save";
  button.onclick = () => saveChangesCourse(button, studentId,courseName);

}


function enableEdit(button, studentId) {
  const row = button.parentElement.parentElement; 
  const cells = row.querySelectorAll("td"); 

  
  cells[0].innerHTML = `<input type="number" value="${cells[0].innerText}" />`;
  cells[1].innerHTML = `<input type="text" value="${cells[1].innerText}" />`;

  button.innerText = "Save";
  button.onclick = () => saveChanges(button, studentId);

}


function saveChangesCourse(button, studentId, courseName) {
  const row = button.parentElement.parentElement;
  const inputs = row.querySelectorAll("input");

  
  const student = students.find((s) => s.id === String(studentId));
  if (!student) {
    alert("Student not found");
    return;
  }


  
  let course;
  for (let i = 0; i < student.courseList.length; i++) {
    if (student.courseList[i].courseName.courseName === courseName) {
      course = student.courseList[i];
      break;
    }
  }

  if (!course) {
    alert("Course not found");
    return;
  }

 
  course.midterm = Number(inputs[0].value); 
  course.final = Number(inputs[1].value);   
  course.grade = calcLetter(course.midterm, course.final, course.pointScale);

  if (Number(midterm) > 100 || Number(final) > 100) {
    alert("Midterm or Final cannot be higher than 100 Points!");
    return;
}

 
  row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${course.courseName.courseName}</td>
      <td>${course.midterm}</td>
      <td>${course.final}</td>
      <td>${course.grade}</td>
      <td>
          <button onclick="enableEditScores(this, ${student.id})">Edit</button>
      </td>
  `;

  //console.log(`Course updated: ${course.courseName}, Midterm: ${course.midterm}, Final: ${course.final}, Grade: ${course.grade}`);
}




function saveChanges(button, studentId) {
  const row = button.parentElement.parentElement;
  const inputs = row.querySelectorAll("input");
 
  const student = students.find((s) => s.id === String(studentId));
  
  const updatedData = {
      id: inputs[0].value,
      name: inputs[1].value,
  };

  if (/\d/.test(updatedData.name)) {
    alert("Name Cannot be include number");
    return;
  } 
  if (!/^\d+$/.test(updatedData.id)) {
    alert("Student ID must contain only numbers!");
    return;
  }

 
  if (updatedData.id === student.id && updatedData.name === student.name) {
    return; 
}

  if (students.some(s => s.id === updatedData.id)) {
    alert("Enter Different Student ID!");
    return;
  } else if (updatedData.id.length > 9) {
    alert("Student ID too Long");
    return;
  }
  
  student.id = updatedData.id;
  student.name = updatedData.name;

  row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>
          <button onclick="enableEdit(this, ${student.id})">Edit</button>
      </td>
  `;

  const studentCount = document.getElementById("studentCount");
  studentCount.textContent = `Total Students: ${students.length}`;

  studentContainer.style.display = "block";
  manageStudents();
}



function searchStudent() {
  const input = document.getElementById("searchName").value.trim(); 
  const student = students.find((s) => s.name.toLowerCase() === input.toLowerCase() || s.id.toString() === input);
  const tableBody = document.querySelector("#manageTable2 tbody");
  tableBody.innerHTML = ""; 

  if (student) {
    if (student.courseList && student.courseList.length > 0) {
      let totalGPA = 0;
      let courseCount = 0; 

      student.courseList.forEach(course => {
        const row = document.createElement("tr");

        const letterGrade = calcLetter(course.midterm, course.final, 10); 
        const gpa = letterToGPA[letterGrade]; 

        totalGPA += gpa; 
        courseCount++; 

        row.innerHTML = `
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${course.courseName.courseName}</td>
          <td>${course.midterm}</td>
          <td>${course.final}</td>
          <td>${course.grade}</td>
          <td>${gpa.toFixed(2)}</td>
        `;

        tableBody.appendChild(row);
      });

      const averageGPA = (courseCount > 0) ? (totalGPA / courseCount).toFixed(2) : "N/A";

      const gpaRow = document.createElement("tr");
      gpaRow.innerHTML = `
        <td colspan="7" style="text-align: right;"><strong>Overall GPA:</strong> ${averageGPA}</td>
      `;
      tableBody.appendChild(gpaRow);

    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="7">Firstly register to a course.</td>`;
      tableBody.appendChild(row);
    }

  } else {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7">Student not found.</td>`;
    tableBody.appendChild(row);
  }
}





