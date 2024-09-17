// JS/AlteracaoProduto/AlteracaoProdutos.js
document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("alterationModal");
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Display selected main image
    document.getElementById('imagemPrincipal').addEventListener('change', function(event) {
        var mainImageDisplay = document.querySelector('.mainImageDisplay');
        mainImageDisplay.innerHTML = '';
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                mainImageDisplay.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });

    // Display selected additional images
    document.getElementById('imagens').addEventListener('change', function(event) {
        var additionalImagesDisplay = document.querySelector('.additionalImagesDisplay');
        additionalImagesDisplay.innerHTML = '';
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                img.style.marginRight = '10px';
                additionalImagesDisplay.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });
});

// Function to show the modal with a message
function showModal(message) {
    var modal = document.getElementById("alterationModal");
    var modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}