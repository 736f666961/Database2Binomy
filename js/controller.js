let form = document.querySelector("form");

form.onsubmit = Check;

function Check(event){
    // Get Inputs From User
    let price = document.getElementById("price");
    let quantity = document.getElementById("quantity");
    let name = document.getElementById("name");
    let picture = document.getElementById("picture");

    // Check price value
    if (price.value.match(/[0-9]/) && price.value != "" && !(price.value.match(/[a-zA-Z]/))){
        price.style.border = "1px solid green";
    }else{
        price.style.border = "1px solid red";
        event.preventDefault();
    }

    // Check Quantity Value
    if (quantity.value.match(/[0-9]/) && quantity.value != "" && !(price.value.match(/[a-zA-Z]/))){
        quantity.style.border = "1px solid green";
    }else{
        quantity.style.border = "1px solid red";
        event.preventDefault();
    }

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
    console.log("Hi");
}
