(function Check(event){
    // Get Inputs From User
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let address = document.getElementById("address");
    let submit = document.getElementById("submit");

    // Check Id
    let id = document.querySelector(".checked p").id;

    if (id == "false" || id == 0 || Boolean(id) == 0){
        // Disable all inputs
        name.disabled = false;
        email.disabled = false;
        phone.disabled = false;
        address.disabled = false;
        submit.disabled = false;
        console.log("False");
        console.log("1 - Id " + id);
    }else{
        name.disabled = true;
        email.disabled = true;
        phone.disabled = true;
        address.disabled = true;
        submit.disabled = true;
        console.log("True");
        console.log("2 - Id " + id);
    }
})();
