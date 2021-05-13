let form = document.querySelector('#form');
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

  const auth = firebase.auth();
  
 
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let email = form.elements.email.value;
    let password = form.elements.password.value;
    

    auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            form.reset();
            localStorage.setItem("user", JSON.stringify(cred));
            localStorage.setItem("uid", cred.user["uid"]);
            window.alert("Welcome "+email);
            window.location.href = "home.html";
        })
        .catch(err => {
            alert(err.message);
        })
});