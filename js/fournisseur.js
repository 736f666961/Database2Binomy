(function Check(event){
    // Get Inputs From User
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let address = document.getElementById("address");
    let submit = document.getElementById("submit");

    // Check Id
    let id = document.querySelector(".checked p").id;

    if (id == "true"){
        // Disable all inputs
        name.disabled = true;
        email.disabled = true;
        phone.disabled = true;
        address.disabled = true;
        submit.disabled = true;
        // console.log("True");
        // console.log("1 - Id " + id);
    }else{
        // Enable By Default
        name.disabled = false;
        email.disabled = false;
        phone.disabled = false;
        address.disabled = false;
        submit.disabled = false;
        // console.log("False");
        // console.log("2 - Id " + id);

        // Check name value
        if (name.value != "" && name.value.match(/[a-zA-Z]/)){
            name.style.border = "1px solid green";
        }else{
            name.style.border = "1px solid red";
            event.preventDefault();
        }

        // check email value
        if (email.value.indexOf("@") == -1){
            name.style.border = "1px solid red";
            event.preventDefault();
        }else{
            name.style.border = "1px solid green";
        }

        // check phone value
        if (phone.value.match(/[0-9]/) && phone.value != "" && !(price.value.match(/[a-zA-Z]/))){
            phone.style.border = "1px solid green";
        }else{
            phone.style.border = "1px solid red";
            event.preventDefault();
        }

        // Check address value
        if (address.value !=  ""){
            phone.style.border = "1px solid green";
        }else{
            phone.style.border = "1px solid red";
            event.preventDefault();
        }
    }
})();
