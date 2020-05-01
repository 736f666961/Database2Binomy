let form = document.querySelector("form");

form.onsubmit = Check;

function Check(event){
    // Get Inputs From User
    let name = document.getElementById("name");
    let picture = document.getElementById("picture");

    // Check Picture Value
    if (picture.value != ""){
        picture.style.border = "1px solid green";
    }else{
        picture.style.border = "1px solid red";
        event.preventDefault();
    }

    // Check Name Vaue
    if (name.value != "" && name.value.match(/[a-zA-Z]/)){
        name.style.border = "1px solid green";
    }else{
        name.style.border = "1px solid red";
        event.preventDefault();
    }
}
