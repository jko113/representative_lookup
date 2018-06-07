# RepSearch

## Description

RepSearch is an application for obtaining information about elected officials in a given constituency. After entering a physical U.S. address, government officials at the local, state and national levels appear on-screen, complete with a photo (if available) and details about rank, party affiliation, associated website and news articles, as well as social media presence.

Check out [this PowerPoint presentation](https://github.com/jko113/repsearch/raw/master/repsearch_presentation.pptx) for a quick summary of how and why the project was created!

## Demo

<a href="https://youtu.be/kg5R2UQXbb8" target="_blank">Click here for the full RepSearch demo!</a>

[![Main functionality](https://raw.githubusercontent.com/jko113/repsearch/master/images/mainfinal.gif)](https://youtu.be/kg5R2UQXbb8)
<br>
[![Responsiveness](https://raw.githubusercontent.com/jko113/repsearch/master/images/responsivenessfinal.gif)](https://youtu.be/kg5R2UQXbb8)
<br>
[![Social Media](https://raw.githubusercontent.com/jko113/repsearch/master/images/social-mediafinal.gif)](https://youtu.be/kg5R2UQXbb8)

## Technologies

The application is built using HTML, CSS and JavaScript/JQuery and incorporates three public APIs:

* [Google Civic Information](https://developers.google.com/civic-information/)
* [Twitter Embedded Timelines](https://dev.twitter.com/web/embedded-timelines)
* [New York Times Article Search](http://developer.nytimes.com/article_search_v2.json)

## Special Features

* The Google Civic Information API is not a complete data set. As such, many local officials' images are not stored. To remedy this, users can click the "No Image Available" icon and redirect to a Google image search of that official's name.

* The default search yields officials at all levels of government. After submitting a valid address, it is possible to filter search results based on the level of government (or ["OCD identifier"](http://opencivicdata.readthedocs.io/en/latest/proposals/0002.html)).

## Motivation

As engaged citizens (and more-than-occasional listeners of NPR), we deemed it prudent to create an app that makes it easy it find out who your local officials are. We admit that including the Twitter feed was inspired by the current president's penchant for this pithy platform.

## Challenges

### Getting a subset of officials to display

The data set returned from the Google Civic API was keyed by division (i.e., United States, Georgia, Cobb County, and so on). This in turn referenced offices, such as "President of the United States" or "Clerk of Superior Court". These, in turn, referenced the officials themselves. At first, we took the straightforward approach of displaying all officials on screen, but after adding the feature of filtering by division, this no longer worked.

Rather than scrapping the original `getOfficials()` method, we were able to preserve it almost in its entirety, but with the simple modification of passing in an array of `officialIndices` from the dataset. Using this subset, it was possible to then grab only the needed offices per division, and then only the appropriate officials tied to those offices. Here is the code that made correctly placed the event listeners on each division button:

```javascript
function addDivisionListener(button, officeArray) {
    button.on("click", function(event) {
        event.preventDefault();

        var offices = [];
        var officials = [];
        
        if (officeArray) {
            offices = getOffices(officeArray);
        }

        if (offices) {
            officials = getOfficialsByOffice(offices);
        }

        getOfficials(officials);
    });
}
```

### Naming Specifically and Compartmentalizing Functions

After working intensively on the project for several days, the code base kept growing to the point that it became easy to get mixed up. The two methods we employed successfully to address this issue were naming specifically and compartmentalizing functions.

The first method ensured that variables followed the precise nomenclature rules we established during the course of development. For instance, all JQuery variables were named beginning with a "$" character to ensure they weren't treated as standard JavaScript objects. Also, we included descriptive action verbs when defining functions, such as the above logically-grouped series `getOffices()`, `getOfficialsByOffice`, and `getOfficials()`.

The second method involved hammering out the most focused functions we could possibly devise. Whenever we encountered a situation of copying and pasting code, we opted instead to refactor the code into a separate, more generic function. This increased the readibility, integrity, and reusability of the code.

### Understanding Promises and Callbacks

Working with APIs requires properly structured code that ensures data is returned prior to acting upon it. We encountered our fair share of unexpected `undefined` values that we soon figured out were caused by prematurely manipulating data that wasn't yet available.

In order to handle this effectively, we employed both promises and callbacks within the program. For example, in the initial submission of the user's address - the core feature of the application that requests data from the Google Civic API - we defined an AJAX request function (aptly named `ajaxRequest`) that then calls the `getDivisions()` method:

```javascript
var ajaxRequest = $.get(MISSING_ADDRESS + formattedAddress, function(data) {
  localStorage.setItem("repInfo", JSON.stringify(data));
});
        
ajaxRequest
  .then(getDivisions)
```     

This approach was taken for readability and simplicity. You'll note that local storage was used to store the information received from the API. This was especially helpful during the testing phase, because it meant we could avoid making a large number of API calls and rely on the locally stored data set.

Another place this came in handy was obtaining NY Times articles:

```
$.get(requestUrl)
  .then(storeArticles)
  .then(populateArticlePopup)
```

Again, note that cleanliness of the code achieved by defining the function outside of the `.then()` call. Do I sound proud? Yes, I'll admit it.

We also used this approach when grabbing the Twitter embedded timeline (check out the `createTwitterListener()` method!). The callbacks used are too many to name exhaustively, so I'll just mention the supremely cool one Stephen came up with at the last minute (literally, he finished it up like 12 and half seconds before we presented our project) that animates our headshots on the About Me page:

```javascript
$(document).ready(function () {
  $stephenContainer.hover(function () {
    setTimeout(function () {
      $('[data-stephen-flipper').css("transform","rotateY(180deg)");
      $stephenImage.attr("src", "images/github.png");
    }, 15);
  },
  function () {
    $('[data-stephen-flipper').css("transform", "");
      setTimeout(function () {
        $stephenImage.attr("src", "images/stephen.jpg");
      }, 150);
  })
});
```

This introduces an engaging flip animation when hovering over the headshot that greatly increases the interactive feel of the About Me page.

### Scrolling Automatically To Search Results

This is the JQuery code that is triggered on submitting the address form that automatically scrolls the page to the correct location of the search results:

```javascript
$('html, body').animate({
            scrollTop: $(".form-outer-container").outerHeight()
        }, 1000);
```

### Responsiveness

We learned the importance of "mobile first" development because it was comparatively difficult to scale the display down to mobile size after designing the site to display correctly on a desktop browser. We consider this an important lesson, because mobile browsing is such an increasingly popular segment of internet traffic.

A tool that helped immensely in creating a responsive site was Flexbox, which was used to great effect in the header, About Me page, and official cards. Flexbox enabled the quick and easy deployment of a responsive site without having to bog ourselves down in the quagmire of floats and relative positioning. 

## Possible Limitations (or areas for improvement)

* In our testing, the NY Times article search did not prove 100% reliable in the way of yielding germane results, particularly for lower-level officials. This is likely because the API's search algorithm doesn't require that a first and last name be contiguous in the news article, so that searching for "John Miller" might come up with an article containing the names John Jones and Manny Miller. A future improvement to the application would be to further research the API's capabilities to ensure that its search feature is utilized as effectively as possible to limit unrelated results.

* A helpful UI improvement would be to allow only one popup menu to be open at a time, ideally by activating a listener on the document that intelligently handles user behavior, closing any open popup if the user clicks outside the menu or presses the escape key.

* A secondary UI modification would be better handling non-standard image sizes.

## Screenshots

#### The main search screen
![Search](https://raw.githubusercontent.com/jko113/repsearch/master/images/search.png)

#### The list of results with tabs at the top for filtering levels
![Image Search](https://raw.githubusercontent.com/jko113/repsearch/master/images/image%20search.png)

#### The embedded Twitter timeline
![Embedded Timeline](https://raw.githubusercontent.com/jko113/repsearch/master/images/tweets.png)

#### The About page
![About](https://raw.githubusercontent.com/jko113/repsearch/master/images/about.png)

#### Responsive Design
![About](https://raw.githubusercontent.com/jko113/repsearch/master/images/responsive.png)

## Creators

Stephen Jarrett and Joshua Owens

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
