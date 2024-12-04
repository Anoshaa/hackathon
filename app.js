import { auth, db, createUserWithEmailAndPassword, setDoc, doc, signInWithEmailAndPassword, getDoc, updateDoc, deleteDoc, collection, getDocs ,query,where} from "./firebase.js";





// Signup Button Logic
document.getElementById("signupBtn").addEventListener("click", function () {
  Swal.fire({
    title: 'Signup',
    html: `
        <form id="signupForm">
            <div class="mb-3">
                <label for="signupEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="signupEmail" placeholder="Enter your email" required>
            </div>
            <div class="mb-3">
                <label for="signupPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="signupPassword" placeholder="Enter your password" required>
            </div>
            <div class="mb-3">
                <label for="signupName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="signupName" placeholder="Enter your full name" required>
            </div>
        </form>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sign Up',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const signupEmail = document.getElementById('signupEmail').value;
      const signupPassword = document.getElementById('signupPassword').value;
      const signupName = document.getElementById('signupName').value;

      if (!signupEmail || !signupPassword || !signupName) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }

      return createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          return setDoc(doc(db, "users", user.uid), {
            name: signupName,
            email: signupEmail,
            createdAt: new Date(),
          })
          .then(() => {
            return sendEmailVerification(user)
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Registration Successful!",
                  text: "Please verify your email.",
                }).then(() => {
                  location.href = "signin.html"; // Redirect to signin page
                });
              })
              .catch((error) => {
                console.error("Error sending email verification:", error.message);
              });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error saving user data",
              text: error.message,
            });
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text: error.message,
          });
        });
    }
  });
});

// Signin Button Logic
document.getElementById("signinBtn").addEventListener("click", function () {
  Swal.fire({
    title: 'Signin',
    html: `
        <form id="signinForm">
            <div class="mb-3">
                <label for="signinEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="signinEmail" placeholder="Enter your email" required>
            </div>
            <div class="mb-3">
                <label for="signinPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="signinPassword" placeholder="Enter your password" required>
            </div>
        </form>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sign In',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const signinEmail = document.getElementById('signinEmail').value;
      const signinPassword = document.getElementById('signinPassword').value;

      if (!signinEmail || !signinPassword) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }

      return signInWithEmailAndPassword(auth, signinEmail, signinPassword)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Signed in successfully!",
            text: "You are now logged in.",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Signin Failed",
            text: "Invalid email or password.",
          });
        });
    }
  });
});

// Add Post Logic
document.getElementById("addPostBtn").addEventListener("click", function () {
  Swal.fire({
    title: 'Add Post',
    html: `
        <form id="addPostForm">
            <div class="mb-3">
                <label for="postTitle" class="form-label">Post Title</label>
                <input type="text" class="form-control" id="postTitle" placeholder="Enter post title" required>
            </div>
            <div class="mb-3">
                <label for="postContent" class="form-label">Post Content</label>
                <textarea class="form-control" id="postContent" placeholder="Enter post content" required></textarea>
            </div>
        </form>
    `,
    confirmButtonText: 'Add Post',
    preConfirm: () => {
      const postTitle = document.getElementById('postTitle').value;
      const postContent = document.getElementById('postContent').value;

      if (!postTitle || !postContent) {
        Swal.showValidationMessage('Please fill in all fields');
        return false;
      }

      const user = auth.currentUser;
      if (user) {
        const postId = new Date().getTime().toString(); // Using timestamp for unique ID
        const postRef = doc(db, "posts", postId);

        return setDoc(postRef, {
          title: postTitle,
          content: postContent,
          userId: user.uid,
          createdAt: new Date(),
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Post added successfully!",
            text: "Your post has been added.",
          });
          loadPosts();  // Reload posts after adding a new one
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error adding post",
            text: error.message,
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Not signed in",
          text: "You must be signed in to add a post.",
        });
      }
    }
  });
});

// Fetch and Display Posts
function loadPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = '';  // Clear previous posts

  const postsRef = collection(db, "posts");

  getDocs(postsRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id; // Get the post ID

        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>Posted on: ${new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
          <button class="btn btn-primary btn-sm edit-post-btn" data-post-id="${postId}">Edit</button>
          <button class="btn btn-danger btn-sm delete-post-btn" data-post-id="${postId}">Delete</button>
        `;
        postsContainer.appendChild(postElement);
      });

      // Add event listeners to the edit and delete buttons
      document.querySelectorAll('.edit-post-btn').forEach(button => {
        button.addEventListener('click', handleEditPost);
      });

      document.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', handleDeletePost);
      });
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

// Edit Post Logic
function handleEditPost(event) {
  const postId = event.target.getAttribute('data-post-id');
  const postRef = doc(db, "posts", postId);
  
  getDoc(postRef).then((docSnap) => {
    const postData = docSnap.data();
    Swal.fire({
      title: 'Edit Post',
      html: `
          <form id="editPostForm">
              <div class="mb-3">
                  <label for="editPostTitle" class="form-label">Post Title</label>
                  <input type="text" class="form-control" id="editPostTitle" value="${postData.title}" required>
              </div>
              <div class="mb-3">
                  <label for="editPostContent" class="form-label">Post Content</label>
                  <textarea class="form-control" id="editPostContent" required>${postData.content}</textarea>
              </div>
          </form>
      `,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const editedTitle = document.getElementById('editPostTitle').value;
        const editedContent = document.getElementById('editPostContent').value;

        return updateDoc(postRef, {
          title: editedTitle,
          content: editedContent,
          updatedAt: new Date(),
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Post updated successfully!",
          });
          loadPosts();  // Reload posts after editing
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error updating post",
            text: error.message,
          });
        });
      }
    });
  });
}

// Delete Post Logic
function handleDeletePost(event) {
  const postId = event.target.getAttribute('data-post-id');
  const postRef = doc(db, "posts", postId);

  Swal.fire({
    title: 'Are you sure?',
    text: "This post will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteDoc(postRef)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Post deleted successfully!",
          });
          loadPosts();  // Reload posts after deletion
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error deleting post",
            text: error.message,
          });
        });
    }
  });
}

// Load posts when the page loads
document.addEventListener("DOMContentLoaded", loadPosts);



// Function to search posts
document.getElementById("search-bar").addEventListener("input", async (event) => {
  const searchText = event.target.value.toLowerCase(); // Get the search text
  const postsContainer = document.getElementById("postsContainer"); // Container for posts
  postsContainer.innerHTML = ""; // Clear previous posts

  try {
    const postsRef = collection(db, "posts");

    // Firestore query to match the title of posts partially
    const q = query(postsRef, 
      where("title", ">=", searchText), 
      where("title", "<=", searchText + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postId = doc.id;

      // Render post content
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>Posted on: ${new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
        <button class="btn btn-primary btn-sm edit-post-btn" data-post-id="${postId}">Edit</button>
        <button class="btn btn-danger btn-sm delete-post-btn" data-post-id="${postId}">Delete</button>
      `;
      postsContainer.appendChild(postElement);
    });

    // Add event listeners to the edit and delete buttons
    document.querySelectorAll('.edit-post-btn').forEach(button => {
      button.addEventListener('click', handleEditPost);
    });

    document.querySelectorAll('.delete-post-btn').forEach(button => {
      button.addEventListener('click', handleDeletePost);
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});



