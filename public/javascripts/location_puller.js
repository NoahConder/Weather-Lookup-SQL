document.getElementById("location_finder").onclick = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};

function successFunction(position) {
    console.log(position);
    // Update the hidden form fields with latitude and longitude values
    document.getElementById("latitude").value = position.coords.latitude;
    document.getElementById("longitude").value = position.coords.longitude;
    // Submit the form
    document.getElementById("weatherForm").submit();
}

function errorFunction() {
    console.log("Unable to retrieve your location.");
}