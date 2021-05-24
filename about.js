var firebaseConfig = {
    apiKey: "AIzaSyBFkmspKoi-RDOMZfL-k9__70YIaS7vLn0",
    authDomain: "notedemo-a1e15.firebaseapp.com",
    projectId: "notedemo-a1e15",
    storageBucket: "notedemo-a1e15.appspot.com",
    messagingSenderId: "641128485554",
    appId: "1:641128485554:web:db3794ada96d08b1ea2fab"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const dbRef = firebase.database()
const auth = firebase.auth();


let fsignout=0;
//Authentication function to check if any user is logged in
firebase.auth().onAuthStateChanged(function(user) {


if(user){
//Logout Function
document.querySelector('#signout').addEventListener('click', function () {
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            fsignout=1;
            window.alert("You have Logged Out Succesfully.");
            window.location = "index.html";
        }).catch((error) => {
            // An error happened.
            alert(error.message);
        });
});
}
else if(fsignout==0) {
  window.alert("You need to LogIn First.Redirecting to Home Page.");
  window.location="index.html";
}
});