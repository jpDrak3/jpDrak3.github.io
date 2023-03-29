$(function () {
    $(".commentHeader").click(function () {
        $(this).next(".commentContainer").slideToggle();
    });
    $(".commentContainer").hide();

    // Chained animation
    $("#growOnLoad")
        .animate({
            width: "25%",
            height: "25%",
            top: "-=5%",
            left: "-=5%"
        }, 1500)
        .animate({ opacity: "80%" });
});

//Comment Section
// Adapted from https://javascript.plainenglish.io/how-to-create-a-comment-section-using-html-and-vanilla-js-aa6b6a53b9cf

const commentAppendedContainer = document.querySelectorAll(".allComments");
const addCommentBtn = document.querySelectorAll(".addComments");
const newCommentTextarea = document.querySelectorAll(".commentTextArea");
let comments = [];

// Load comments from session storage when the page is loaded
for (let i = 0; i < commentAppendedContainer.length; i++) {
    if (sessionStorage.getItem("comments")) {
        // Clear out existing comments
        commentAppendedContainer[i].innerHTML = "";
        comments = [];
        // Add comments from session storage
        const storedComments = JSON.parse(sessionStorage.getItem("comments"));
        storedComments.forEach(function (comment) {
            addComment(commentAppendedContainer[i], comment.text, comment.likes);
        });
    }

    addCommentBtn[i].addEventListener("click", function (e) {
        e.preventDefault(); // prevent form submission
        const commentText = newCommentTextarea[i].value.trim();
        if (commentText === "") return; // will not add empty comments
        addComment(commentAppendedContainer[i], commentText, 0);
        newCommentTextarea[i].value = ""; // clear the text area
    });
}

function addComment(container, commentText, likes) {
    const comment = { text: commentText, likes: likes };
    comments.push(comment);
    sessionStorage.setItem("comments", JSON.stringify(comments));

    const textBox = document.createElement("div");
    textBox.textContent = commentText;
    textBox.className = "commentTextBox";

    const likeButton = document.createElement("button");
    likeButton.classList.add("likeComment");
    likeButton.textContent = `Like (${likes})`;
    likeButton.addEventListener("click", function () {
        likes++;
        likeButton.textContent = `Like (${likes})`;
        comment.likes = likes;
        sessionStorage.setItem("comments", JSON.stringify(comments));
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteComment");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
        const index = comments.indexOf(comment);
        comments.splice(index, 1);
        sessionStorage.setItem("comments", JSON.stringify(comments));
        wrapDiv.remove();
    });

    const wrapDiv = document.createElement("div");
    wrapDiv.classList.add("wrapper");
    wrapDiv.style.marginLeft = 0;
    wrapDiv.append(textBox, likeButton, deleteButton);

    container.appendChild(wrapDiv);
}

// Save for Later Page

//Add the SAVE button to items
function addSaveButton() {
    const items = document.querySelectorAll(".itemToSave");
    items.forEach((item) => {
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save for later";
        saveButton.className = "btn btn-secondary";
        saveButton.addEventListener("click", () => {
            // Get the item data that needs to be saved, including the parent element's HTML
            const itemData = item.parentNode.outerHTML;

            // Get the existing saved items from sessionStorage
            let savedItems = JSON.parse(sessionStorage.getItem("savedItems")) || [];

            // Check for duplicates
            const isDuplicate = savedItems.some((savedItem) => savedItem === itemData);
            if (isDuplicate) {
                alert("This item is already saved!");
                return;
            }

            // Add the new item to the saved items array
            savedItems.push(itemData);

            // Save the updated saved items array back to sessionStorage
            sessionStorage.setItem("savedItems", JSON.stringify(savedItems));

            // Update the alert message to display the number of saved items
            const numSavedItems = savedItems.length;
            alert(`Success! You have ${numSavedItems} saved items
Check them out in "Your Library"`);

        });
        item.appendChild(saveButton);
    });
}
addSaveButton();


// Add a "Like" button to items/articles
function addLikeForm(HTMLelement, itemId) {
    if (!HTMLelement) {
        return;
    }

    const likeForm = document.createElement("form");
    likeForm.addEventListener("submit", function (e) {
        e.preventDefault(); //Prevent default submission
    });

    // Get like count from session storage
    let likeCount = parseInt(sessionStorage.getItem(`likeCount_${itemId}`)) || 0;

    // Create the like button
    const likeItemButton = document.createElement("button");
    likeItemButton.type = "submit";
    likeItemButton.textContent = `Like (${likeCount})`;
    likeItemButton.className = "btn btn-secondary";
    likeItemButton.addEventListener("click", function () {
        if (sessionStorage.getItem(`liked_${itemId}`)) {
            return;
        }
        likeCount++;
        sessionStorage.setItem(`likeCount_${itemId}`, likeCount);
        sessionStorage.setItem(`liked_${itemId}`, true);
        likeItemButton.textContent = `Like (${likeCount})`;
    });

    // Add the like button to the form
    likeForm.appendChild(likeItemButton);

    // Add the form to the specified HTML element
    HTMLelement.appendChild(likeForm);
}

const likeFormButtons = document.querySelectorAll(".likedItem");

// Loop through each element and add the like form
for (let i = 0; i < likeFormButtons.length; i++) {
    const likeFormButton = likeFormButtons[i];
    addLikeForm(likeFormButton, `itemId${i}`);
}
