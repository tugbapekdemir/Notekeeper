// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// !html de js e elemanların çekilmesi

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupButton = document.querySelector("#form-btn");

// ! global scope sahip değişkenler

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let isUpdate = false;
let updateId = null;
// sayfa yüklendiği anda rendernotes fonks calişiır
document.addEventListener("DOMContentLoaded", renderNotes(notes));

// note içerisindeki menüyü aktif edecek fonks
function showMenu(item) {
  const parentElement = item.parentElement;

  // parentelemente show classı ekle
  parentElement.classList.add("show");
  // pasife çek
  document.addEventListener("click", (e) => {
    // eğer
    if (e.target.tagName !== "I" || e.target !== item) {
      parentElement.classList.remove("show");
    }
  });
}

// note elemanını silecek fonks

function deleteNote(item) {
  // silme işlemi için onay
  const response = confirm("Bu notu silmek istediğinize emin misiniz ?");

  // onaylandıysa
  if (response) {
    const noteItem = item.closest(".note");

    const noteId = Number(noteItem.dataset.id);

    notes = notes.filter((note) => note.id !== noteId);

    // ! güncel note dizisine göre localestroge güncelle
    localStorage.setItem("notes", JSON.stringify(notes));

    // render et
    renderNotes(notes);
  }
}

// note elema güncell fonks
function editNote(item) {
  const note = item.closest(".note");
  const noteId = parseInt(note.dataset.id);
  const foundedNote = notes.find((note) => note.id == noteId);

  // popup aktif etmek için
  popupBox.classList.add("show");
  popup.classList.add("show");

  //

  document.body.style.overflow = "hidden";

  // form içersndki elemnlar note deger ata

  form[0].value = foundedNote.title;
  form[1].value = foundedNote.description;
  //  güncelleme modu

  isUpdate = true;
  updateId = noteId;

  //

  popupTitle.textContent = "Update Note";
  popupButton.textContent = "Update";
}

//  wrapper elemanına

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // Note ile alakalı yönetimi sağlayan menü'yü aktif et
    showMenu(e.target);
  }

  // delete-icon class'ına sahip elemana tıklandıysa
  else if (e.target.classList.contains("delete-icon")) {
    deleteNote(e.target);
  }
  // edit-icon class'ına sahip elemana tıklandıysa
  else if (e.target.classList.contains("edit-icon")) {
    editNote(e.target);
  }
});
// popup aktif etmek için olay dizisi

addBox.addEventListener("click", () => {
  popupBox.classList.add("show");
  popup.classList.add("show");

  document.body.style.overflow = "hidden";
});

// popup pasif etmek için

closeBtn.addEventListener("click", () => {
  popupBox.classList.remove("show");
  popup.classList.remove("show");

  document.body.style.overflow = "auto";

  form.reset();
  // popup eski haline cevir
  popupTitle.textContent = "New Note";
  popupButton.textContent = "Add";
  isUpdate = false;
  updateId = null;
});

// formun gönderilmesini izle

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = e.target[0];
  const descriptionInput = e.target[1];

  const title = titleInput.value;
  const description = descriptionInput.value;

  if (!title || !description) {
    alert("title ve description kısımları boş bırakılamaz.");

    return;
  }
  //   güncel tarih

  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month];
  const year = date.getFullYear();
  const id = date.getTime();

  //   popup güncelleme modunda
  if (isUpdate) {
    const updateIndex = notes.findIndex((note) => note.id == updateId);

    // dizi güncelle
    notes[updateIndex] = {
      title,
      description,
      date: `${updateMonth} ${day}, ${year}`,
      id,
    };
    // popu eski haline çevir
    popupTitle.textContent = "New Note";
    popupButton.textContent = "Add";
    isUpdate = false;
    updateId = null;
  } else {
    let noteItem = {
      title,
      description,
      date: `${updateMonth} ${day}, ${year}`,
      id,
    };

    notes.push(noteItem);
  }

  //   localstroge kayıt
  localStorage.setItem("notes", JSON.stringify(notes));

  // formu temizle
  form.reset();

  // popup pasife çek

  popupBox.classList.remove("show");
  popup.classList.remove("show");

  document.body.style.overflow = "auto";

  renderNotes(notes);
});

// notları arayüze render edecek fonksiyon
function renderNotes(notes) {
  document.querySelectorAll(".note").forEach((noteItem) => noteItem.remove());
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.dataset.id = String(note.id);
    noteElement.innerHTML = `
          <div class="details">
            <h2>${note.title}</h2>
            <p>${note.description}</p>
          </div>
          <div class="bottom">
            <p>${note.date}</p>
            <div class="settings">
              <i class="bx bx-dots-horizontal-rounded"></i>
              <ul class="menu">
                <li class="edit-icon"><i class="bx bx-edit"></i>Edit</li>
                <li class="delete-icon"><i class="bx bx-trash-alt"></i>Delete</li>
              </ul>
            </div>
          </div>
        `;
    wrapper.appendChild(noteElement);
  });
}
