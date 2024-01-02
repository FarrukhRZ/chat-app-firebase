// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.database();

// Get user's data
const user = prompt("Enter your name");
const friend = prompt("Enter your friend's name");

const chatTitle = [user, friend].sort().join("-");

// Submit form and send message to database
document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();

  // Gather values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Clear the input box
  messageInput.value = "";

  // Auto-scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // Create database collection and send data
  database.ref(`messages/${chatTitle}/${timestamp}`).set({
    username: user,
    message,
  });
}

// Display the messages
const chatReference = database.ref(`messages/${chatTitle}/`);

// Listen for new messages using the onChildAdded event listener
chatReference.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const messageClass = user === messages.username ? "sent" : "receive";
  const message = `<li class=${messageClass}><span>${messages.username}: </span>${messages.message}</li>`;

  // Append the message on the page
  document.getElementById("messages").innerHTML += message;
});