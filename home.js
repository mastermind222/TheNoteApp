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
let fsignout = 0;
let flagEdit=0;
var editIndex=-1;
//Authentication function to check if any user is logged in
firebase.auth().onAuthStateChanged(function(user) {


    if (user) {
             console.log("Welcome to notes app. This is app.js");
           getNotesForThisUser().then(notes => display(notes)).catch(err => handleError(err))
            
    	} else if(fsignout==0)  {
        window.alert("You need to LogIn First.Redirecting to Home Page.");
        window.location = "index.html";
    }
});

        //dipslay
        


        // If user adds a note, add it to the Firebase
        let addBtn = document.getElementById("addBtn");
        addBtn.addEventListener("click", function(e) {

            if (document.getElementById("addTxt").value != "" && flagEdit===0) {
                saveNoteToFirebase(document.getElementById("addTxt").value)
                    .then(async res => {
                        let notes = await getNotesForThisUser()
                        display(notes)
                        document.getElementById("addTxt").value = "";
                    })
                    .catch(err => console.log(err))
            }else if(flagEdit===1){
                
                if(document.getElementById("addTxt").value !=""){
                    updateNote(localStorage.getItem("uid"),editIndex,document.getElementById("addTxt").value);
                    getNotesForThisUser().then(notes => display(notes)).catch(err => handleError(err));
                    document.getElementById("addTxt").value='';

                }
                else window.alert("Warning: Empty Note")

                flagEdit=0;
                editIndex=-1;

                replaceButtonText('addBtn','Add Note');
            }
            else {
                window.alert("Warning: Empty Note")
            }
        });




        // Function to show elements from Firebase
        function display(notes) {
            let i = 1;
            let html = "";

            Object.keys(notes).forEach(function(k, i) {
                html += `
                <div class="noteCard my-2 mx-2 card" content="centre" style="width: 21rem;">
                        <div class="card-body">
                            <h5 class="card-title">Note ${i + 1}</h5>
                            <p class="card-text"> ${notes[k]}</p>
                            <button id="${k}" onclick="deleteNote(this.id)" class="btn btn-primary">Delete Note</button>
                            <button id="${k}" onclick="editNote(this.id)" class="btn btn-primary">Edit Note</button>
                        </div>
                    </div>`;
                i++
            });
            let notesElm = document.getElementById("notes");
            if (i > 0)
                notesElm.innerHTML = html;
            else
                notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
            return;
        }

        //function to write data
        function updateNote(userId, noteId, newBody) {
            let updates={['/notes/' + userId + '/' + noteId] : newBody}
            
            return firebase.database().ref().update(updates, (e) => {
              if (e) console.log(e)
            })
          }

        //Function to edit a note
        function editNote(index){
            const uid = localStorage.getItem("uid")
            var adaRef = firebase.database().ref('notes/' + uid + '/' + index);
            adaRef.get().then((snapshot) => {
                if (snapshot.exists()) {
                   var crrntNote=snapshot.val();
                   document.getElementById("addTxt").value =crrntNote;
                   replaceButtonText('addBtn','Update Note');
                   flagEdit=1;
                   editIndex=index;
                  
                } 
              }).catch((error) => {
                console.error(error);
              });
        }

        // Function to delete a note
        function deleteNote(index) {
            const uid = localStorage.getItem("uid")
            var adaRef = firebase.database().ref('notes/' + uid + '/' + index);
            adaRef.remove()
                .then(function() {
                    getNotesForThisUser().then(notes => display(notes)).catch(err => handleError(err))
                })
                .catch(function(error) {
                    console.log("Remove failed: " + error.message)
                });



        }



        function replaceButtonText(buttonId, text)
        {
            if (document.getElementById)
            {
                var button=document.getElementById(buttonId);
                if (button)
                {
                if (button.childNodes[0])
                {
                    button.childNodes[0].nodeValue=text;
                }
                else if (button.value)
                {
                    button.value=text;
                }
                else //if (button.innerHTML)
                {
                    button.innerHTML=text;
                }
                }
            }
        }


        let search = document.getElementById('searchTxt');
        search.addEventListener("input", function() {

            let inputVal = search.value.toLowerCase();
            // console.log('Input event fired!', inputVal);
            let noteCards = document.getElementsByClassName('noteCard');
            Array.from(noteCards).forEach(function(element) {
                let cardTxt = element.getElementsByTagName("p")[0].innerText;
                if (cardTxt.toLowerCase().includes(inputVal)) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }
                // console.log(cardTxt);
            })
        })

        async function saveNoteWithTitle(title, content) {
            const uid = localStorage.getItem("uid")

            const userNoteRef = dbRef.ref('notes/' + uid)
            const noteKey = userNoteRef.push().key
            let upd = {
                ['/notes/' + uid + noteKey]: {
                    title,
                    content
                }
            }

            return await dbRef.update(upd)
        }

        async function saveNoteToFirebase(content) {
            const uid = localStorage.getItem("uid")
            //window.alert("Successfully Added");
            const userNoteRef = dbRef.ref('notes/' + uid)
            let notes = await getNotesForThisUser()
            return await userNoteRef.set({
                ...notes,
                [Date.now()]: content
            })
        }

        async function getNotesForThisUser() {
            const uid = localStorage.getItem("uid")
            const userNotesRef = dbRef.ref('notes/' + uid)
            const ss = await userNotesRef.get()
            if (ss.exists())
                return ss.val()
            else {
                let notesElm = document.getElementById("notes");
                notesElm.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`;
                return;
            }

        }
        //LogOut Function
        document.querySelector('#signout').addEventListener('click', function() {
            auth.signOut()
                .then(() => {
                    // Sign-out successful.
                    window.alert("You have Logged Out Succesfully.");
                    window.location = "index.html";
                    fsignout = 1;
                }).catch((error) => {
                    // An error happened.
                    alert(error.message);
                });
        });

    
/*
TODO: Further Features:
1. Add Title
2. Mark a note as Important
3. Separate notes by user
4. Sync and host to web server 
*/
