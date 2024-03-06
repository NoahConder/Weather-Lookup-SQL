function fetchWeatherData(query) {
    fetch(`/autocomplete?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
            const resultsDiv = document.getElementById('autocomplete_results');
            resultsDiv.innerHTML = '';

            // Filter out items with undefined values for name, state, or country
            const filteredData = data.filter(item => {
                return item.name && item.state && item.country;
            });

            // Create and append the weather data list items
            filteredData.forEach((item) => {
                console.log(item)
                const cityName = item.name;
                const stateCode = item.state;
                const countryCode = item.country;
                const listItem = document.createElement('div');
                listItem.textContent = `${cityName}, ${stateCode}, ${countryCode}`;
                listItem.classList.add('autocomplete-item');
                listItem.addEventListener('click', () => {
                    document.getElementById('location_input_box').value = listItem.textContent;
                    resultsDiv.innerHTML = ''; // Clear the results
                });
                resultsDiv.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here
        });
}
// Function to handle input in the location input box
function handleInput(event) {
    const inputText = event.target.value;
    if (inputText.length >= 3) {
        fetchWeatherData(inputText);
    } else {
        // Clear the autocomplete results if input is less than 3 characters
        document.getElementById('autocomplete_results').innerHTML = '';
    }
}

// Attach event listener to the location input box
document.getElementById('location_input_box').addEventListener('input', handleInput);