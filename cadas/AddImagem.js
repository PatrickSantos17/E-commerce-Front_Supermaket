const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");

const inputFile2 = document.querySelector("#picture__input2");
const pictureImage2 = document.querySelector(".picture__image2");

const inputFile3 = document.querySelector("#picture__input3");
const pictureImage3 = document.querySelector(".picture__image3");

const inputFile4 = document.querySelector("#picture__input4");
const pictureImage4 = document.querySelector(".picture__image4");

const pictureImageTxt = "Escolha uma imagem";
pictureImage.innerHTML = pictureImageTxt;
pictureImage2.innerHTML = pictureImageTxt;
pictureImage3.innerHTML = pictureImageTxt;
pictureImage4.innerHTML = pictureImageTxt;

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

inputFile2.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img2");

      pictureImage2.innerHTML = "";
      pictureImage2.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage2.innerHTML = pictureImageTxt;
  }
});

inputFile3.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img3");

      pictureImage3.innerHTML = "";
      pictureImage3.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage3.innerHTML = pictureImageTxt;
  }
});

inputFile4.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img4");

      pictureImage4.innerHTML = "";
      pictureImage4.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage4.innerHTML = pictureImageTxt;
  }
});