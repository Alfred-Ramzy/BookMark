SiteNameInput = document.getElementById("SiteName");
WebSiteURLInput = document.getElementById("WebSiteURL");
BtnAddInput = document.getElementById("BtnAdd");
BookmarkSearchInput = document.getElementById("BookmarkSearch");
UrlList = [];

if (localStorage.getItem("UrlKey") !== null) {
  UrlList = JSON.parse(localStorage.getItem("UrlKey"));
  DisplayUrl();
}
function AddUrl() {
  if (validateSiteName() && validateURL()) {
    var userInputUrl = WebSiteURLInput.value.trim();
    if (
      !userInputUrl.startsWith("http://") &&
      !userInputUrl.startsWith("https://")
    ) {
      userInputUrl = "https://" + userInputUrl;
    }

    var url = {
      name: SiteNameInput.value.trim(),
      url: userInputUrl,
    };

    UrlList.push(url);
    localStorage.setItem("UrlKey", JSON.stringify(UrlList));
    DisplayUrl();
    clearform();
  } else {
    Swal.fire({
      title: "Site Name or Url is not valid, Please follow the rules below:",
      html: `
    <ul style="text-align: left; list-style: none; padding: 0;">
      <li class="mb-2"><i class="fa-solid fa-arrows-turn-right me-2" style="color: #B197FC;"></i>Site name must contain at least 3 characters</li>
      <li><i class="fa-solid fa-arrows-turn-right me-2" style="color: #B197FC;"></i> Site URL must be a valid one</li>
    </ul>
  `,
      icon: "error",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        htmlContainer: "custom-html",
      },
      showConfirmButton: true,
      confirmButtonText: "Got it!",
    });
  }
}

function clearform() {
  SiteNameInput.value = "";
  WebSiteURLInput.value = "";

  SiteNameInput.classList.remove("is-valid");
  SiteNameInput.classList.remove("is-invalid");

  WebSiteURLInput.classList.remove("is-valid");
  WebSiteURLInput.classList.remove("is-invalid");

  document.getElementById("msgName").classList.add("d-none");
  document.getElementById("msgURL").classList.add("d-none");
}
function DisplayUrl() {
  var cartoona = "";
  for (var i = 0; i < UrlList.length; i++) {
    cartoona += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td><h5>${UrlList[i].name}</h5></td>
        <td>
          <a href="${UrlList[i].url}" target="_blank" rel="noopener noreferrer">
            <button class="btn btn-outline-info">
              <i class="fa-regular fa-eye me-1"></i>Visit
            </button>
          </a>
        </td>
        <td>
          <button onclick="DeleteUrl(${i})" class="btn btn-outline-danger">
            <i class="fa-solid fa-trash me-1"></i>Delete
          </button>
        </td>
      </tr>
    `;
  }
  document.getElementById("mybody").innerHTML = cartoona;
}
function DeleteUrl(index) {
  Swal.fire({
    title: "Are you sure you want to delete this bookmark?",
    text: "This action cannot be undone!",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      UrlList.splice(index, 1);
      localStorage.setItem("UrlKey", JSON.stringify(UrlList));
      DisplayUrl();
      Swal.fire("Deleted!", "The bookmark has been deleted.", "success");
    } else if (result.isDismissed) {
      Swal.fire("Cancelled", "The bookmark was not deleted.", "info");
    }
  });
}

function validateSiteName() {
  var regex = /^[a-zA-Z][a-zA-Z0-9 _-]{2,19}$/;
  var text = document.getElementById("SiteName").value;
  var msgName = document.getElementById("msgName");
  var siteNameInput = document.getElementById("SiteName");
  if (regex.test(text)) {
    siteNameInput.classList.add("is-valid");
    siteNameInput.classList.remove("is-invalid");
    msgName.classList.add("d-none");
    return true;
  } else {
    siteNameInput.classList.add("is-invalid");
    siteNameInput.classList.remove("is-valid");
    msgName.classList.remove("d-none");
    return false;
  }
}

function validateURL() {
  var regex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  var text = document.getElementById("WebSiteURL").value;
  var msgURL = document.getElementById("msgURL");
  var urlInput = document.getElementById("WebSiteURL");

  if (regex.test(text)) {
    urlInput.classList.add("is-valid");
    urlInput.classList.remove("is-invalid");
    msgURL.classList.add("d-none");
    return true;
  } else {
    urlInput.classList.add("is-invalid");
    urlInput.classList.remove("is-valid");
    msgURL.classList.remove("d-none");

    return false;
  }
}

function SearchByName() {
  var regex = new RegExp(BookmarkSearchInput.value, "gi");
  var text = BookmarkSearchInput.value;
  var cartoona = ``;
  for (var i = 0; i < UrlList.length; i++) {
    if (UrlList[i].name.toLowerCase().includes(text.toLowerCase())) {
      cartoona += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td><h5>${UrlList[i].name.replace(
          regex,
          (match) => `<span class="Highlit">${match}</span>`
        )}</h5></td>
        <td>
          <a href="${UrlList[i].url}" target="_blank" rel="noopener noreferrer">
            <button class="btn btn-outline-info">
              <i class="fa-regular fa-eye me-1"></i>Visit
            </button>
          </a>
        </td>
        <td>
          <button onclick="DeleteUrl(${i})" class="btn btn-outline-danger">
            <i class="fa-solid fa-trash me-1"></i>Delete
          </button>
        </td>
      </tr>
    `;
    }
    document.getElementById("mybody").innerHTML = cartoona;
  }
}

let isAscending = true;

function SortByName() {
  UrlList.sort((a, b) => {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();

    if (isAscending) {
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    }
  });

  localStorage.setItem("UrlKey", JSON.stringify(UrlList));
  DisplayUrl();

  Swal.fire({
    icon: "success",
    title: "Sorted A to Z!",
    text: "Bookmarks have been sorted alphabetically.",
    timer: 1500,
    showConfirmButton: false,
  });
}

function DeleteAllBookmarks() {
  Swal.fire({
    title: "Are you sure you want to delete all bookmarks?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete all!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      UrlList = [];
      localStorage.setItem("UrlKey", JSON.stringify(UrlList));
      DisplayUrl();
      Swal.fire("Deleted!", "All bookmarks have been deleted.", "success");
    } else {
      Swal.fire("Cancelled", "Your bookmarks are safe.", "info");
    }
  });
}
